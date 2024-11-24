const express = require('express');
const router = express.Router();
const Jewelry = require('../models/Jewelry');

// 创建新珠宝
router.post('/', async (req, res) => {
    try {
        const jewelry = new Jewelry(req.body);
        const savedJewelry = await jewelry.save();
        res.status(201).json(savedJewelry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 获取所有珠宝
router.get('/', async (req, res) => {
    try {
        const jewelries = await Jewelry.find();
        res.json(jewelries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 