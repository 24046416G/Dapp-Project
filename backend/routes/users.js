const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
            customerId
        } = req.body;

        // 检查必填字段
        if (!role || !password) {
            return res.status(400).json({ 
                message: "Role and password are required" 
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
            customerId
        });

        // 保存用户
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            role: user.role,
            userId: user._id
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// 新增：连接钱包
router.patch('/:id/connect', async (req, res) => {
    try {
        const { walletAddress, publicKey, balance } = req.body;
        const userId = req.params.id;

        // 验证必要字段
        if (!walletAddress || !publicKey) {
            return res.status(400).json({ 
                message: "Wallet address and public key are required" 
            });
        }

        // 使用 MongoDB 的 _id 查找用户
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 检查钱包地址是否已被使用
        const existingWallet = await User.findOne({ walletAddress });
        if (existingWallet && existingWallet._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "Wallet address already in use" });
        }

        // 更新用户信息
        user.walletAddress = walletAddress;
        user.publicKey = publicKey;
        if (balance !== undefined) {
            user.balance = balance;
        }

        await user.save();

        res.json({
            message: "Wallet connected successfully",
            user: {
                id: user._id,
                role: user.role,
                walletAddress: user.walletAddress,
                balance: user.balance
            }
        });
    } catch (error) {
        console.error('Wallet connection error:', error);
        res.status(500).json({ message: error.message });
    }
});

// 获取所有用户列表
router.get('/all', async (req, res) => {
    try {
        // 排除敏感信息
        const users = await User.find()
            .select('-password')
            .populate('ownedDiamonds')
            .populate('ownedJewelries');
        
        res.json(users.map(user => ({
            id: user._id,
            role: user.role,
            walletAddress: user.walletAddress,
            publicKey: user.publicKey,
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
            publicKey: user.publicKey,
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
            publicKey: user.publicKey,
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

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { companyId, customerId, password } = req.body;

        // 验证必要字段
        if ((!companyId && !customerId) || !password) {
            return res.status(400).json({ 
                message: "Either companyId or customerId, and password are required" 
            });
        }

        // 根据 companyId 或 customerId 查找用户
        let user;
        if (companyId) {
            user = await User.findOne({ companyId });
        } else if (customerId) {
            user = await User.findOne({ customerId });
        }

        // 验证用户是否存在
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 返回用户信息
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                role: user.role,
                companyId: user.companyId,
                companyName: user.companyName,
                customerId: user.customerId,
                customerName: user.customerName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 用户登出
router.post('/logout', (req, res) => {
    try {
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 