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
router.patch('/:diamondId', async (req, res) => {
    try {
        const { newOwnerId, newStatus, price, certificateHash, metadata, jewelryId } = req.body;

        const diamond = await Diamond.findOne({ diamondId: req.params.diamondId });
        if (!diamond) {
            return res.status(404).json({ message: "Diamond not found" });
        }

        // 验证新所有者
        const newOwner = await User.findById(newOwnerId);
        if (!newOwner) {
            return res.status(404).json({ message: "New owner not found" });
        }

        // 验证状态转换
        const validStatusTransitions = {
            'MINED': ['CUT'],
            'CUT': ['GRADED'],
            'GRADED': ['JEWELRY'],
            'JEWELRY': ['SOLD'],
            'SOLD': []
        };

        if (!validStatusTransitions[diamond.status].includes(newStatus)) {
            return res.status(400).json({ 
                message: `Invalid status transition from ${diamond.status} to ${newStatus}` 
            });
        }

        // 验证新所有者的角色
        const roleStatusMap = {
            'CUT': 'CUTTING_COMPANY',
            'GRADED': 'GRADING_LAB',
            'JEWELRY': 'JEWELRY_MAKER',
            'SOLD': 'CUSTOMER'
        };

        if (newOwner.role !== roleStatusMap[newStatus]) {
            return res.status(400).json({ 
                message: `Invalid owner role for status ${newStatus}` 
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

        // 更新metadata
        if (newStatus === 'CUT' && metadata.cut && metadata.polish) {
            diamond.metadata.cut = metadata.cut;
            diamond.metadata.polish = metadata.polish;
        } else if (newStatus === 'GRADED' && metadata.grading) {
            diamond.metadata.grading = metadata.grading;
        }

        // 更新jewelryId
        if (newStatus === 'JEWELRY' && jewelryId) {
            diamond.jewelryId = jewelryId;
        }

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

        // 更新用户的钻石所有权
        const previousOwner = await User.findById(diamond.currentOwner);
        previousOwner.ownedDiamonds = previousOwner.ownedDiamonds.filter(
            d => d.toString() !== diamond._id.toString()
        );
        await previousOwner.save();

        newOwner.ownedDiamonds.push(diamond._id);
        await newOwner.save();

        await diamond.save();
        res.json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
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