const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const { 
            role, 
            password, 
            companyName, 
            companyId, 
            certificate, 
            customerName, 
            customerId, 
            balance,
            privateKey,
            publicKey,
            walletAddress
        } = req.body;

        // 检查必填字段
        if (!role || !password || !privateKey || !publicKey || !walletAddress) {
            return res.status(400).json({ 
                message: "Role, password, privateKey, publicKey, and walletAddress are required" 
            });
        }

        // 根据角色验证必填字段
        if (role !== 'CUSTOMER' && (!companyName || !companyId || !certificate)) {
            return res.status(400).json({ message: "Company details are required for business roles" });
        }

        if (role === 'CUSTOMER' && (!customerName || !customerId)) {
            return res.status(400).json({ message: "Customer details are required" });
        }

        // 哈希密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户实例
        const user = new User({
            role,
            password: hashedPassword,
            companyName,
            companyId,
            certificate,
            customerName,
            customerId,
            balance: balance || 0,
            privateKey,
            publicKey,
            walletAddress
        });

        // 保存用户
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            walletAddress: user.walletAddress,
            role: user.role,
            userId: user._id,
            balance: user.balance
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { walletAddress, password } = req.body;

        const user = await User.findOne({ walletAddress });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: {
            id: user._id,
            role: user.role,
            walletAddress: user.walletAddress
        }});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取用户信息
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password -privateKey')
            .populate('ownedDiamonds')
            .populate('ownedJewelries');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取所有用户列表
router.get('/all', async (req, res) => {
    try {
        // 排除敏感信息
        const users = await User.find()
            .select('-password -privateKey')
            .populate('ownedDiamonds')
            .populate('ownedJewelries');
        
        res.json(users.map(user => ({
            id: user._id,
            role: user.role,
            walletAddress: user.walletAddress,
            companyName: user.companyName,
            companyId: user.companyId,
            customerName: user.customerName,
            customerId: user.customerId,
            balance: user.balance,
            ownedDiamonds: user.ownedDiamonds,
            ownedJewelries: user.ownedJewelries,
            createdAt: user.createdAt
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 获取特定用户信息（通过ID）
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -privateKey')
            .populate('ownedDiamonds')
            .populate('ownedJewelries');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            role: user.role,
            walletAddress: user.walletAddress,
            companyName: user.companyName,
            companyId: user.companyId,
            customerName: user.customerName,
            customerId: user.customerId,
            balance: user.balance,
            ownedDiamonds: user.ownedDiamonds,
            ownedJewelries: user.ownedJewelries,
            createdAt: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 通过角色查找用户
router.get('/role/:role', async (req, res) => {
    try {
        const users = await User.find({ role: req.params.role })
            .select('-password -privateKey')
            .populate('ownedDiamonds')
            .populate('ownedJewelries');

        res.json(users.map(user => ({
            id: user._id,
            role: user.role,
            walletAddress: user.walletAddress,
            companyName: user.companyName,
            companyId: user.companyId,
            customerName: user.customerName,
            customerId: user.customerId,
            balance: user.balance,
            ownedDiamonds: user.ownedDiamonds,
            ownedJewelries: user.ownedJewelries,
            createdAt: user.createdAt
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 