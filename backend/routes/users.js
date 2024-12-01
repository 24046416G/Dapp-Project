const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// User registration
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

        // Check required fields
        if (!role || !password) {
            return res.status(400).json({ 
                message: "Role and password are required" 
            });
        }

        // Validate required fields based on role
        if (role !== 'CUSTOMER' && (!companyName || !companyId || !certificate)) {
            return res.status(400).json({ message: "Company details are required for business roles" });
        }

        if (role === 'CUSTOMER' && (!customerName || !customerId)) {
            return res.status(400).json({ message: "Customer details are required" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance
        const user = new User({
            role,
            password: hashedPassword,
            companyName,
            companyId,
            certificate,
            customerName,
            customerId
        });

        // Save user
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

// New: Connect wallet
router.patch('/:id/connect', async (req, res) => {
    try {
        const { walletAddress, publicKey, balance } = req.body;
        const userId = req.params.id;

        // Validate required fields
        if (!walletAddress || !publicKey) {
            return res.status(400).json({ 
                message: "Wallet address and public key are required" 
            });
        }

        // Use MongoDB's _id to find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if wallet address is already in use
        const existingWallet = await User.findOne({ walletAddress });
        if (existingWallet && existingWallet._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: "Wallet address already in use" });
        }

        // Update user information
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

// Get all user list
router.get('/all', async (req, res) => {
    try {
        // Exclude sensitive information
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

// Get specific user information (by ID)
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

// Find users by role
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

// User login
router.post('/login', async (req, res) => {
    try {
        const { companyId, customerId, password } = req.body;

        // Validate required fields
        if ((!companyId && !customerId) || !password) {
            return res.status(400).json({ 
                message: "Either companyId or customerId, and password are required" 
            });
        }

        // Find user by companyId or customerId
        let user;
        if (companyId) {
            user = await User.findOne({ companyId });
        } else if (customerId) {
            user = await User.findOne({ customerId });
        }

        // Validate user existence
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Return user information
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

// User logout
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