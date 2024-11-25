//backend/routes/diamonds.js
//api for diamonds
const express = require('express');
const router = express.Router();
const Diamond = require('../models/Diamond');

// 创建新钻石
router.post('/', async (req, res) => {
    try {
        const diamond = new Diamond(req.body);
        const savedDiamond = await diamond.save();
        res.status(201).json(savedDiamond);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 获取所有钻石
router.get('/', async (req, res) => {
    try {
        const diamonds = await Diamond.find();
        res.json(diamonds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 