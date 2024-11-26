const express = require('express');
const router = express.Router();
const Diamond = require('../models/Diamond');
const User = require('../models/User');

// 创建新钻石（仅限矿业公司）
router.post('/', async (req, res) => {
    try {
        const { diamondId, price, metadata } = req.body;
        
        // 验证当前用户是否为矿业公司
        const user = await User.findById(req.user.userId);
        if (user.role !== 'MINING_COMPANY') {
            return res.status(403).json({ message: "Only mining companies can create diamonds" });
        }

        const diamond = new Diamond({
            diamondId,
            diamondType: 'NATURAL', // 或其他类型
            currentOwner: user._id,
            status: 'MINED',
            price,
            metadata
        });

        await diamond.save();

        // 更新用户的拥有钻石列表
        user.ownedDiamonds.push(diamond._id);
        await user.save();

        res.status(201).json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 添加证书
router.post('/:id/certificate', async (req, res) => {
    try {
        const { certificateType, certificateHash } = req.body;
        const diamond = await Diamond.findById(req.params.id);
        
        if (!diamond) {
            return res.status(404).json({ message: "Diamond not found" });
        }

        await diamond.addCertificate(req.user.userId, certificateHash, certificateType);
        res.json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 更新钻石状态
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const diamond = await Diamond.findById(req.params.id);
        
        if (!diamond) {
            return res.status(404).json({ message: "Diamond not found" });
        }

        diamond.status = status;
        await diamond.save();

        res.json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取钻石详情
router.get('/:id', async (req, res) => {
    try {
        const diamond = await Diamond.findById(req.params.id)
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('certificates.jewelryCertificate.companyId');

        if (!diamond) {
            return res.status(404).json({ message: "Diamond not found" });
        }

        res.json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取钻石列表
router.get('/', async (req, res) => {
    try {
        const diamonds = await Diamond.find()
            .populate('currentOwner', 'companyName customerName');
        res.json(diamonds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 