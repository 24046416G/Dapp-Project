const express = require('express');
const router = express.Router();
const Jewelry = require('../models/Jewelry');
const Diamond = require('../models/Diamond');
const User = require('../models/User');

// Create a new jewelry (only for jewelry makers)
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
        
        // Validate required fields
        if (!jewelryId || !name || !diamonds || !currentOwner || !price) {
            return res.status(400).json({ 
                message: "JewelryId, name, diamonds, currentOwner and price are required" 
            });
        }

        // Validate if the current user is a jewelry maker
        const user = await User.findById(currentOwner);
        if (!user || user.role !== 'JEWELRY_MAKER') {
            return res.status(403).json({ message: "Only jewelry makers can create jewelry" });
        }

        // Validate if all diamonds belong to the maker and are in the correct status
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

        // Validate image data (if provided)
        if (image) {
            // Validate if it is a valid Base64 image data
            if (!image.match(/^data:image\/(png|jpeg|jpg|gif);base64,/)) {
                return res.status(400).json({ 
                    message: "Invalid image format. Must be a Base64 encoded image" 
                });
            }

            // Validate image size (Base64 string length)
            if (image.length > 5 * 1024 * 1024) {  // 5MB limit
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

        // Update the status of all diamonds to JEWELRY and set jewelryId
        await Diamond.updateMany(
            { _id: { $in: diamonds } },
            { 
                status: 'JEWELRY',
                jewelryId: jewelry._id
            }
        );

        // Update the user's owned jewelries list
        if (!user.ownedJewelries.includes(jewelry._id)) {
            user.ownedJewelries.push(jewelry._id);
            await user.save();
        }

        // Return the created jewelry information (with populate)
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

// Get jewelry list
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

// Get user's owned jewelries list
router.get('/user/:userId', async (req, res) => {
    try {
        // Validate if the user exists
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all jewelries owned by the user
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

// Get jewelry details
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

// Transfer jewelry ownership (sell to customers or transfer between customers)
router.patch('/:id/transfer', async (req, res) => {
    try {
        const { newOwnerId } = req.body;

        // Validate required fields
        if (!newOwnerId) {
            return res.status(400).json({ message: "New owner ID is required" });
        }

        // Find the jewelry
        const jewelry = await Jewelry.findById(req.params.id)
            .populate('currentOwner')
            .populate('diamonds')
            .populate('history.owner');
        
        if (!jewelry) {
            return res.status(404).json({ message: "Jewelry not found" });
        }

        // Validate the new owner
        const newOwner = await User.findById(newOwnerId);
        if (!newOwner) {
            return res.status(404).json({ message: "New owner not found" });
        }

        // Validate transfer permission
        // 1. If the current owner is a jewelry maker, the new owner must be a customer
        // 2. If the current owner is a customer, the new owner must also be a customer
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

        // Save the current owner ID
        const currentOwnerId = jewelry.currentOwner._id;

        // Update jewelry ownership
        jewelry.currentOwner = newOwnerId;
        jewelry.history.push({
            owner: newOwnerId,
            status: 'TRANSFERRED',
            timestamp: new Date(),
            transaction: jewelry.authenticityCertificate
        });

        await jewelry.save();

        // If transferring from a jewelry maker to a customer, update related diamond status to SOLD
        if (jewelry.currentOwner.role === 'JEWELRY_MAKER') {
            await Diamond.updateMany(
                { _id: { $in: jewelry.diamonds } },
                { status: 'SOLD' }
            );
        }

        // Update the previous owner's owned jewelries list
        const previousOwner = await User.findById(currentOwnerId);
        if (previousOwner) {
            previousOwner.ownedJewelries = previousOwner.ownedJewelries.filter(
                j => j.toString() !== jewelry._id.toString()
            );
            await previousOwner.save();
        }

        // Update the new owner's owned jewelries list
        if (!newOwner.ownedJewelries.includes(jewelry._id)) {
            newOwner.ownedJewelries.push(jewelry._id);
            await newOwner.save();
        }

        // Return the updated jewelry information
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

// 添加新的路由处理证书查询
router.get('/query/:certificateHash', async (req, res) => {
    try {
        const { certificateHash } = req.params;

        const jewelry = await Jewelry.findOne({ 
            authenticityCertificate: certificateHash 
        })
        .populate('currentOwner')
        .populate('diamonds');

        if (!jewelry) {
            return res.status(404).json({ 
                message: "No jewelry found with this certificate" 
            });
        }

        res.json({
            message: "Jewelry found successfully",
            jewelry
        });
    } catch (error) {
        console.error('Query jewelry error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message
        });
    }
});

module.exports = router; 