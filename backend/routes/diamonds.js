const express = require('express');
const router = express.Router();
const Diamond = require('../models/Diamond');
const User = require('../models/User');
const { contract } = require('../config/web3');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// 矿业公司注册新钻石
router.post('/mine', auth, roleCheck(['MINING_COMPANY']), async (req, res) => {
    try {
        const { diamondId, price, metadata } = req.body;

        // 调用智能合约
        const result = await contract.methods.registerDiamond(
            diamondId,
            JSON.stringify(metadata)
        ).send({ from: req.user.walletAddress });

        const diamond = new Diamond({
            diamondId,
            currentOwner: req.user._id,
            status: 'MINED',
            price,
            metadata,
            history: [{
                status: 'MINED',
                owner: req.user._id,
                timestamp: new Date(),
                transaction: result.transactionHash
            }]
        });

        await diamond.save();

        // 更新用户的钻石列表
        await User.findByIdAndUpdate(req.user._id, {
            $push: { ownedDiamonds: diamond._id }
        });

        res.status(201).json(diamond);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 切割公司处理钻石
router.put('/cut/:diamondId', auth, roleCheck(['CUTTING_COMPANY']), async (req, res) => {
    try {
        const diamond = await Diamond.findOne({ diamondId: req.params.diamondId });
        if (!diamond || diamond.status !== 'MINED') {
            throw new Error('Invalid diamond state');
        }

        const result = await contract.methods.updateDiamondStatus(
            diamond.diamondId,
            'CUT'
        ).send({ from: req.user.walletAddress });

        diamond.status = 'CUT';
        diamond.history.push({
            status: 'CUT',
            owner: req.user._id,
            timestamp: new Date(),
            transaction: result.transactionHash
        });

        await diamond.save();
        res.json(diamond);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 质检实验室认证
router.put('/certify/:diamondId', auth, roleCheck(['GRADING_LAB']), async (req, res) => {
    try {
        const { uniqueID, certificateNumber } = req.body;
        const diamond = await Diamond.findOne({ diamondId: req.params.diamondId });
        
        if (!diamond || diamond.status !== 'CUT') {
            throw new Error('Invalid diamond state');
        }

        const result = await contract.methods.certifyDiamond(
            diamond.diamondId,
            uniqueID,
            certificateNumber
        ).send({ from: req.user.walletAddress });

        diamond.status = 'CERTIFIED';
        diamond.uniqueID = uniqueID;
        diamond.metadata.certificateNumber = certificateNumber;
        diamond.history.push({
            status: 'CERTIFIED',
            owner: req.user._id,
            timestamp: new Date(),
            transaction: result.transactionHash
        });

        await diamond.save();
        res.json(diamond);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 验证钻石真实性
router.get('/verify/:diamondId', async (req, res) => {
    try {
        const diamond = await Diamond.findOne({ diamondId: req.params.diamondId })
            .populate('currentOwner')
            .populate({
                path: 'history.owner',
                select: 'companyName customerName role'
            });

        if (!diamond) {
            throw new Error('Diamond not found');
        }

        // 从区块链获取验证信息
        const blockchainData = await contract.methods.getDiamond(req.params.diamondId).call();

        const verificationResult = {
            diamond,
            blockchainVerification: blockchainData,
            isAuthentic: diamond.uniqueID === blockchainData.uniqueID
        };

        res.json(verificationResult);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 