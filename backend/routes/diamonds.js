const express = require('express');
const router = express.Router();
const Diamond = require('../models/Diamond');
const User = require('../models/User');

// 1. 矿业公司开采钻石
router.post('/mine', async (req, res) => {
    try {
        const { diamondId, diamondType, currentOwner, price, certificateHash, metadata } = req.body;

        // 验证当前用户是否为矿业公司
        const miningCompany = await User.findById(currentOwner);
        if (!miningCompany || miningCompany.role !== 'MINING_COMPANY') {
            return res.status(403).json({ message: "Only mining companies can mine diamonds" });
        }

        // 创建新钻石
        const diamond = new Diamond({
            diamondId,
            diamondType,
            currentOwner,
            status: 'MINED',
            price,
            certificates: {
                miningCertificate: {
                    companyId: currentOwner,
                    certificateHash,
                    timestamp: new Date(),
                    status: 'VERIFIED'
                }
            },
            metadata: {
                origin: metadata.origin,
                color: metadata.color,
                carat: metadata.carat
            }
        });

        // 添加到历史记录
        diamond.history.push({
            status: 'MINED',
            owner: currentOwner,
            timestamp: new Date(),
            transaction: certificateHash
        });

        await diamond.save();

        // 更新矿业公司的拥有钻石列表
        miningCompany.ownedDiamonds.push(diamond._id);
        await miningCompany.save();

        res.status(201).json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. 通过diamondId获取钻石信息
router.get('/:diamondId', async (req, res) => {
    try {
        const diamond = await Diamond.findOne({ diamondId: req.params.diamondId })
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('certificates.jewelryCertificate.companyId')
            .populate('history.owner');

        if (!diamond) {
            return res.status(404).json({ message: "Diamond not found" });
        }

        res.json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. 更新钻石状态和所有权
router.patch('/:id/transfer', async (req, res) => {
    try {
        const { newOwnerId, price, certificateHash } = req.body;

        // 验证请求参数
        if (!newOwnerId || !certificateHash) {
            return res.status(400).json({ 
                message: "newOwnerId and certificateHash are required" 
            });
        }

        // 使用 MongoDB _id 查找钻石，不使用 populate
        const diamond = await Diamond.findById(req.params.id);
        if (!diamond) {
            return res.status(404).json({ 
                message: "Diamond not found",
                providedId: req.params.id 
            });
        }

        // 验证新所有者
        const newOwner = await User.findById(newOwnerId);
        if (!newOwner) {
            return res.status(404).json({ 
                message: "New owner not found",
                providedNewOwnerId: newOwnerId 
            });
        }

        // 确定新状态
        const statusMap = {
            'CUTTING_COMPANY': 'CUT',
            'GRADING_LAB': 'GRADED',
            'JEWELRY_MAKER': 'JEWELRY',
            'CUSTOMER': 'SOLD'
        };
        const newStatus = statusMap[newOwner.role];
        
        if (!newStatus) {
            return res.status(400).json({ 
                message: `Invalid owner role: ${newOwner.role}`,
                validRoles: Object.keys(statusMap)
            });
        }

        // 验证状态转换
        const validStatusTransitions = {
            'MINED': ['CUT'],
            'CUT': ['GRADED'],
            'GRADED': ['JEWELRY'],
            'JEWELRY': ['SOLD'],
            'SOLD': []
        };

        console.log('Current status:', diamond.status);
        console.log('Attempted new status:', newStatus);
        console.log('Valid transitions:', validStatusTransitions[diamond.status]);

        if (!validStatusTransitions[diamond.status]?.includes(newStatus)) {
            return res.status(400).json({ 
                message: `Invalid status transition from ${diamond.status} to ${newStatus}`,
                currentStatus: diamond.status,
                attemptedNewStatus: newStatus,
                validTransitions: validStatusTransitions[diamond.status]
            });
        }

        // 更新证书
        const certificateTypeMap = {
            'CUT': 'cuttingCertificate',
            'GRADED': 'gradingCertificate',
            'JEWELRY': 'jewelryCertificate'
        };

        if (certificateTypeMap[newStatus]) {
            diamond.certificates[certificateTypeMap[newStatus]] = {
                companyId: newOwnerId,
                certificateHash,
                timestamp: new Date(),
                status: 'VERIFIED'
            };
        }

        // 保存当前所有者ID
        const currentOwnerId = diamond.currentOwner;

        // 更新基本信息
        diamond.currentOwner = newOwnerId;
        diamond.status = newStatus;
        if (price) diamond.price = price;

        // 添加到历史记录
        diamond.history.push({
            status: newStatus,
            owner: newOwnerId,
            timestamp: new Date(),
            transaction: certificateHash
        });

        // 更新前任所有者的钻石列表
        if (currentOwnerId) {
            const previousOwner = await User.findById(currentOwnerId);
            if (previousOwner) {
                previousOwner.ownedDiamonds = previousOwner.ownedDiamonds.filter(
                    d => d.toString() !== diamond._id.toString()
                );
                await previousOwner.save();
            }
        }

        // 更新新所有者的钻石列表
        if (!newOwner.ownedDiamonds.includes(diamond._id)) {
            newOwner.ownedDiamonds.push(diamond._id);
            await newOwner.save();
        }

        // 保存钻石更新
        await diamond.save();
        
        // 返回更新后的钻石信息（带 populate）
        const updatedDiamond = await Diamond.findById(req.params.id)
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('certificates.jewelryCertificate.companyId')
            .populate('history.owner');

        res.json({
            message: "Diamond transferred successfully",
            diamond: updatedDiamond
        });
    } catch (error) {
        console.error('Diamond transfer error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 4. 获取所有钻石列表
router.get('/all/diamonds', async (req, res) => {
    try {
        const diamonds = await Diamond.find()
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('certificates.jewelryCertificate.companyId')
            .populate('history.owner');

        res.json(diamonds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 