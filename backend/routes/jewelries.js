const express = require('express');
const router = express.Router();
const Jewelry = require('../models/Jewelry');
const Diamond = require('../models/Diamond');
const User = require('../models/User');

// 创建新珠宝（仅限珠宝制造商）
router.post('/make', async (req, res) => {
    try {
        const { 
            jewelryId, 
            name, 
            authenticityCertificate, 
            diamonds, 
            currentOwner, 
            price, 
            image 
        } = req.body;
        
        // 验证必要字段
        if (!jewelryId || !name || !diamonds || !currentOwner || !price) {
            return res.status(400).json({ 
                message: "JewelryId, name, diamonds, currentOwner and price are required" 
            });
        }

        // 验证当前用户是否为珠宝制造商
        const user = await User.findById(currentOwner);
        if (!user || user.role !== 'JEWELRY_MAKER') {
            return res.status(403).json({ message: "Only jewelry makers can create jewelry" });
        }

        // 验证所有钻石是否属于该制造商且状态为GRADED
        for (let diamondId of diamonds) {
            const diamond = await Diamond.findById(diamondId);
            if (!diamond || diamond.currentOwner.toString() !== currentOwner || 
                diamond.status !== 'GRADED') {
                return res.status(400).json({ 
                    message: "All diamonds must be owned by the jewelry maker and be graded" 
                });
            }
        }

        // 验证图片数据（如果提供）
        if (image) {
            // 验证是否是有效的 Base64 图片数据
            if (!image.match(/^data:image\/(png|jpeg|jpg|gif);base64,/)) {
                return res.status(400).json({ 
                    message: "Invalid image format. Must be a Base64 encoded image" 
                });
            }

            // 验证图片大小（Base64 字符串长度）
            if (image.length > 10 * 1024 * 1024) {  // 5MB 限制
                return res.status(400).json({ 
                    message: "Image size too large. Maximum size is 5MB" 
                });
            }
        }

        const jewelry = new Jewelry({
            jewelryId,
            name,
            authenticityCertificate,
            diamonds,
            currentOwner,
            price,
            image,
            history: [{
                owner: currentOwner,
                status: 'CREATED',
                timestamp: new Date(),
                transaction: authenticityCertificate || 'INITIAL_CREATION'
            }]
        });

        await jewelry.save();

        // 更新所有钻石的状态为JEWELRY
        await Diamond.updateMany(
            { _id: { $in: diamonds } },
            { 
                status: 'JEWELRY',
                jewelryId: jewelry._id
            }
        );

        // 更新用户的拥有珠宝列表
        user.ownedJewelries.push(jewelry._id);
        await user.save();

        // 返回创建的珠宝信息（带 populate）
        const populatedJewelry = await Jewelry.findById(jewelry._id)
            .populate('currentOwner')
            .populate('diamonds')
            .populate('history.owner');

        res.status(201).json({
            message: "Jewelry created successfully",
            jewelry: populatedJewelry
        });
    } catch (error) {
        console.error('Jewelry creation error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 获取珠宝详情
router.get('/:id', async (req, res) => {
    try {
        const jewelry = await Jewelry.findById(req.params.id)
            .populate('currentOwner')
            .populate('diamonds');

        if (!jewelry) {
            return res.status(404).json({ message: "Jewelry not found" });
        }

        res.json(jewelry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取珠宝列表
router.get('/', async (req, res) => {
    try {
        const jewelries = await Jewelry.find()
            .populate('currentOwner', 'companyName customerName')
            .populate('diamonds');
        res.json(jewelries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 转移珠宝所有权（销售给客户）
router.post('/:id/transfer', async (req, res) => {
    try {
        const { newOwnerId } = req.body;
        const jewelry = await Jewelry.findById(req.params.id);
        
        if (!jewelry) {
            return res.status(404).json({ message: "Jewelry not found" });
        }

        const newOwner = await User.findById(newOwnerId);
        if (!newOwner || newOwner.role !== 'CUSTOMER') {
            return res.status(400).json({ message: "Invalid new owner" });
        }

        // 更新珠宝所有权
        jewelry.currentOwner = newOwnerId;
        jewelry.history.push({
            owner: newOwnerId,
            status: 'TRANSFERRED',
            timestamp: new Date(),
            transaction: 'SALE' // 这里可以添加区块链交易哈希
        });

        await jewelry.save();

        // 更新相关钻石状态
        await Diamond.updateMany(
            { _id: { $in: jewelry.diamonds } },
            { status: 'SOLD' }
        );

        // 更新用户的珠宝列表
        const previousOwner = await User.findById(req.user.userId);
        previousOwner.ownedJewelries = previousOwner.ownedJewelries.filter(
            j => j.toString() !== jewelry._id.toString()
        );
        await previousOwner.save();

        newOwner.ownedJewelries.push(jewelry._id);
        await newOwner.save();

        res.json(jewelry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 