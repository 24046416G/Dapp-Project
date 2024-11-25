const express = require('express');
const router = express.Router();
const Jewelry = require('../models/Jewelry');
const Diamond = require('../models/Diamond');
const User = require('../models/User');
const { contract } = require('../config/web3');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// 珠宝商创建新珠宝
router.post('/create', auth, roleCheck(['JEWELRY_MAKER']), async (req, res) => {
    try {
        const { jewelryId, name, diamondIds, price, metadata } = req.body;

        // 验证所有钻石
        const diamonds = await Diamond.find({
            diamondId: { $in: diamondIds },
            status: 'CERTIFIED'
        });

        if (diamonds.length !== diamondIds.length) {
            throw new Error('Invalid diamonds selection');
        }

        // 调用智能合约
        const result = await contract.methods.createJewelry(
            jewelryId,
            diamondIds,
            JSON.stringify(metadata)
        ).send({ from: req.user.walletAddress });

        const jewelry = new Jewelry({
            jewelryId,
            name,
            diamonds: diamonds.map(d => d._id),
            currentOwner: req.user._id,
            price,
            metadata,
            history: [{
                owner: req.user._id,
                status: 'CREATED',
                timestamp: new Date(),
                transaction: result.transactionHash
            }]
        });

        await jewelry.save();

        // 更新钻石状态
        await Diamond.updateMany(
            { _id: { $in: diamonds.map(d => d._id) } },
            { 
                status: 'JEWELRY',
                jewelryId: jewelry._id
            }
        );

        res.status(201).json(jewelry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 购买珠宝
router.post('/purchase/:jewelryId', auth, roleCheck(['CUSTOMER']), async (req, res) => {
    try {
        const jewelry = await Jewelry.findOne({ jewelryId: req.params.jewelryId });
        
        if (!jewelry || jewelry.currentOwner.toString() === req.user._id.toString()) {
            throw new Error('Invalid jewelry or already owned');
        }

        // 检查余额
        if (req.user.balance < jewelry.price) {
            throw new Error('Insufficient balance');
        }

        // 调用智能合约
        const result = await contract.methods.purchaseJewelry(
            jewelry.jewelryId
        ).send({ 
            from: req.user.walletAddress,
            value: web3.utils.toWei(jewelry.price.toString(), 'ether')
        });

        // 更新所有权
        const previousOwner = jewelry.currentOwner;
        jewelry.currentOwner = req.user._id;
        jewelry.history.push({
            owner: req.user._id,
            status: 'SOLD',
            timestamp: new Date(),
            transaction: result.transactionHash
        });

        await jewelry.save();

        // 更新用户信息
        await User.findByIdAndUpdate(previousOwner, {
            $pull: { ownedJewelries: jewelry._id }
        });
        await User.findByIdAndUpdate(req.user._id, {
            $push: { ownedJewelries: jewelry._id }
        });

        res.json(jewelry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 