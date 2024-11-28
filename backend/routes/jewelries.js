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

        // 验证所有钻石是否属于该制造商且状态正确
        for (let diamondId of diamonds) {
            const diamond = await Diamond.findById(diamondId);
            if (!diamond || 
                diamond.currentOwner.toString() !== currentOwner || 
                (diamond.status !== 'GRADED' && diamond.status !== 'JEWELRY')) {
                return res.status(400).json({ 
                    message: "All diamonds must be owned by the jewelry maker and be in GRADED or JEWELRY status" 
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
            if (image.length > 5 * 1024 * 1024) {  // 5MB 限制
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

        // 更新所有钻石的状态为JEWELRY并设置jewelryId
        await Diamond.updateMany(
            { _id: { $in: diamonds } },
            { 
                status: 'JEWELRY',
                jewelryId: jewelry._id
            }
        );

        // 更新用户的拥有珠宝列表
        if (!user.ownedJewelries.includes(jewelry._id)) {
            user.ownedJewelries.push(jewelry._id);
            await user.save();
        }

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

// 获取珠宝列表
router.get('/all', async (req, res) => {
    try {
        const jewelries = await Jewelry.find()
            .populate('currentOwner')
            .populate('diamonds')
            .populate('history.owner');

        res.json({
            message: "Jewelries retrieved successfully",
            count: jewelries.length,
            jewelries
        });
    } catch (error) {
        console.error('Get jewelries error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 获取用户拥有的珠宝列表
router.get('/user/:userId', async (req, res) => {
    try {
        // 验证用户是否存在
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 查找用户拥有的所有珠宝
        const jewelries = await Jewelry.find({ currentOwner: req.params.userId })
            .populate('currentOwner')
            .populate('diamonds')
            .populate('history.owner');

        res.json({
            message: "User's jewelries retrieved successfully",
            userId: req.params.userId,
            userRole: user.role,
            count: jewelries.length,
            jewelries
        });
    } catch (error) {
        console.error('Get user jewelries error:', error);
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
            .populate('diamonds')
            .populate('history.owner');

        if (!jewelry) {
            return res.status(404).json({ message: "Jewelry not found" });
        }

        res.json({
            message: "Jewelry found successfully",
            jewelry
        });
    } catch (error) {
        console.error('Get jewelry error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 转移珠宝所有权（销售给客户或客户间转让）
router.patch('/:id/transfer', async (req, res) => {
    try {
        const { newOwnerId } = req.body;

        // 验证必要字段
        if (!newOwnerId) {
            return res.status(400).json({ message: "New owner ID is required" });
        }

        // 查找珠宝
        const jewelry = await Jewelry.findById(req.params.id)
            .populate('currentOwner')
            .populate('diamonds')
            .populate('history.owner');
        
        if (!jewelry) {
            return res.status(404).json({ message: "Jewelry not found" });
        }

        // 验证新所有者
        const newOwner = await User.findById(newOwnerId);
        if (!newOwner) {
            return res.status(404).json({ message: "New owner not found" });
        }

        // 验证转让权限
        // 1. 如果当前所有者是珠宝制造商，新所有者必须是客户
        // 2. 如果当前所有者是客户，新所有者也必须是客户
        if (jewelry.currentOwner.role === 'JEWELRY_MAKER' && newOwner.role !== 'CUSTOMER') {
            return res.status(403).json({ 
                message: "Jewelry maker can only transfer to customers" 
            });
        }

        if (jewelry.currentOwner.role === 'CUSTOMER' && newOwner.role !== 'CUSTOMER') {
            return res.status(403).json({ 
                message: "Customers can only transfer to other customers" 
            });
        }

        // 保存当前所有者ID
        const currentOwnerId = jewelry.currentOwner._id;

        // 更新珠宝所有权
        jewelry.currentOwner = newOwnerId;
        jewelry.history.push({
            owner: newOwnerId,
            status: 'TRANSFERRED',
            timestamp: new Date(),
            transaction: jewelry.authenticityCertificate
        });

        await jewelry.save();

        // 如果是从珠宝制造商转让给客户，更新相关钻石状态为SOLD
        if (jewelry.currentOwner.role === 'JEWELRY_MAKER') {
            await Diamond.updateMany(
                { _id: { $in: jewelry.diamonds } },
                { status: 'SOLD' }
            );
        }

        // 更新前任所有者的珠宝列表
        const previousOwner = await User.findById(currentOwnerId);
        if (previousOwner) {
            previousOwner.ownedJewelries = previousOwner.ownedJewelries.filter(
                j => j.toString() !== jewelry._id.toString()
            );
            await previousOwner.save();
        }

        // 更新新所有者的珠宝列表
        if (!newOwner.ownedJewelries.includes(jewelry._id)) {
            newOwner.ownedJewelries.push(jewelry._id);
            await newOwner.save();
        }

        // 返回更新后的珠宝信息
        const updatedJewelry = await Jewelry.findById(req.params.id)
            .populate('currentOwner')
            .populate('diamonds')
            .populate('history.owner');

        res.json({
            message: "Jewelry transferred successfully",
            jewelry: updatedJewelry
        });
    } catch (error) {
        console.error('Jewelry transfer error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 