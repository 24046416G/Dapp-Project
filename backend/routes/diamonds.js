const express = require('express');
const router = express.Router();
const Diamond = require('../models/Diamond');
const User = require('../models/User');

// 1. Mining company mines diamonds
router.post('/mine', async (req, res) => {
    try {
        const { diamondId, diamondType, currentOwner, price, certificateHash, metadata } = req.body;

        // Verify if the current user is a mining company
        const miningCompany = await User.findById(currentOwner);
        if (!miningCompany || miningCompany.role !== 'MINING_COMPANY') {
            return res.status(403).json({ message: "Only mining companies can mine diamonds" });
        }

        // Create a new diamond
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

        // Add to history
        diamond.history.push({
            status: 'MINED',
            owner: currentOwner,
            timestamp: new Date(),
            transaction: certificateHash
        });

        await diamond.save();

        // Update the mining company's owned diamonds list
        miningCompany.ownedDiamonds.push(diamond._id);
        await miningCompany.save();

        res.status(201).json(diamond);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Get diamond information by diamondId
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

// 3. Update diamond status and ownership
router.patch('/:id/transfer', async (req, res) => {
    try {
        const { newOwnerId, price, certificateHash } = req.body;

        // Validate request parameters
        if (!newOwnerId || !certificateHash) {
            return res.status(400).json({ 
                message: "newOwnerId and certificateHash are required" 
            });
        }

        // Find the diamond
        const diamond = await Diamond.findById(req.params.id);
        if (!diamond) {
            return res.status(404).json({ 
                message: "Diamond not found" 
            });
        }

        // Validate new owner
        const newOwner = await User.findById(newOwnerId);
        if (!newOwner) {
            return res.status(404).json({ 
                message: "New owner not found" 
            });
        }

        // Save the current owner ID
        const currentOwnerId = diamond.currentOwner;

        // Update diamond information
        diamond.currentOwner = newOwnerId;
        if (price) diamond.price = price;

        // Update certificate status
        if (newOwner.role === 'CUSTOMER') {
            diamond.status = 'SOLD';
        }

        // Add transfer record
        diamond.history.push({
            status: diamond.status,
            owner: newOwnerId,
            timestamp: new Date(),
            transaction: certificateHash
        });

        await diamond.save();

        // Update the previous owner's diamond list
        const previousOwner = await User.findById(currentOwnerId);
        if (previousOwner) {
            previousOwner.ownedDiamonds = previousOwner.ownedDiamonds.filter(
                d => d.toString() !== diamond._id.toString()
            );
            await previousOwner.save();
        }

        // Update the new owner's diamond list
        if (!newOwner.ownedDiamonds.includes(diamond._id)) {
            newOwner.ownedDiamonds.push(diamond._id);
            await newOwner.save();
        }

        // Return the updated diamond information
        const updatedDiamond = await Diamond.findById(req.params.id)
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('history.owner');

        res.json({
            message: "Diamond transferred successfully",
            diamond: updatedDiamond
        });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message
        });
    }
});

// 4. Get all diamonds list
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

// 5. Update diamond cutting and polishing information
router.patch('/:id/cut', async (req, res) => {
    try {
        const { cut, polish, userId, certificateHash } = req.body;

        // Validate necessary fields
        if (!cut || !polish || !userId || !certificateHash) {
            return res.status(400).json({ 
                message: "Cut, polish, userId and certificateHash are required" 
            });
        }

        // Find the diamond
        const diamond = await Diamond.findById(req.params.id);
        if (!diamond) {
            return res.status(404).json({ 
                message: "Diamond not found",
                providedId: req.params.id 
            });
        }

        // Validate if the user exists and is a cutting company
        const user = await User.findById(userId);
        if (!user || user.role !== 'CUTTING_COMPANY') {
            return res.status(403).json({ 
                message: "Only cutting companies can update cut information" 
            });
        }

        // Validate if the diamond status is CUT
        if (diamond.status !== 'CUT') {
            return res.status(400).json({ 
                message: "Diamond must be in CUT status to update cut information",
                currentStatus: diamond.status
            });
        }

        // Validate if the user is the current owner of the diamond
        if (diamond.currentOwner.toString() !== userId) {
            return res.status(403).json({ 
                message: "Only the current owner can update cut information" 
            });
        }

        // Update cutting and polishing information
        diamond.metadata.cut = cut;
        diamond.metadata.polish = polish;
        diamond.certificates.cuttingCertificate.certificateHash = certificateHash;

        await diamond.save();

        // Return the updated diamond information
        const updatedDiamond = await Diamond.findById(req.params.id)
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('certificates.jewelryCertificate.companyId')
            .populate('history.owner');

        res.json({
            message: "Diamond cut information updated successfully",
            diamond: updatedDiamond
        });
    } catch (error) {
        console.error('Update cut information error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 6. Update diamond grading information
router.patch('/:id/grade', async (req, res) => {
    try {
        const { userId, grading, imageData, certificateHash } = req.body;  // imageData is Base64 encoded image data
        console.log('Received request body:', {
            userId,
            grading,
            certificateHash,
            hasImageData: !!imageData,
            imageDataLength: imageData ? imageData.length : 0
        });

        // Validate necessary fields
        if (!userId || !grading || !certificateHash) {
            return res.status(400).json({ 
                message: "UserId and grading information are required" 
            });
        }

        // Validate image data (if provided)
        if (imageData) {
            console.log('Validating image data...');
            // Validate if it is a valid Base64 image data
            if (!imageData.match(/^data:image\/(png|jpeg|jpg|gif);base64,/)) {
                return res.status(400).json({ 
                    message: "Invalid image format. Must be a Base64 encoded image" 
                });
            }

            // Validate image size (Base64 string length)
            if (imageData.length > 5 * 1024 * 1024) {  // 5MB limit
                return res.status(400).json({ 
                    message: "Image size too large. Maximum size is 5MB" 
                });
            }
            console.log('Image validation passed');
        }

        // Find the diamond
        const diamond = await Diamond.findById(req.params.id);
        if (!diamond) {
            return res.status(404).json({ 
                message: "Diamond not found",
                providedId: req.params.id 
            });
        }

        // Validate if the user exists and is a grading lab
        const user = await User.findById(userId);
        if (!user || user.role !== 'GRADING_LAB') {
            return res.status(403).json({ 
                message: "Only grading labs can update grading information" 
            });
        }

        // Validate if the diamond status is GRADED
        if (diamond.status !== 'GRADED') {
            return res.status(400).json({ 
                message: "Diamond must be in GRADED status to update grading information",
                currentStatus: diamond.status
            });
        }

        // Validate if the user is the current owner of the diamond
        if (diamond.currentOwner.toString() !== userId) {
            return res.status(403).json({ 
                message: "Only the current owner can update grading information" 
            });
        }

        // Update grading information
        console.log('Updating diamond metadata...');
        diamond.metadata.grading = grading;
        diamond.certificates.gradingCertificate.certificateHash = certificateHash;
        if (imageData) {
            console.log('Setting image data...');
            diamond.metadata.images = imageData;  // Directly store Base64 image data
        }

        await diamond.save();
        console.log('Diamond saved successfully');

        // Return the updated diamond information
        const updatedDiamond = await Diamond.findById(req.params.id)
            .populate('currentOwner')
            .populate('certificates.miningCertificate.companyId')
            .populate('certificates.cuttingCertificate.companyId')
            .populate('certificates.gradingCertificate.companyId')
            .populate('certificates.jewelryCertificate.companyId')
            .populate('history.owner');

        res.json({
            message: "Diamond grading information updated successfully",
            diamond: updatedDiamond
        });
    } catch (error) {
        console.error('Update grading information error:', error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 