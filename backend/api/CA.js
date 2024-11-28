const express = require('express');
const router = express.Router();
const CAInfo = require('../lib/CA/CAinfo');
// 获取CA公钥
router.get('/public-key', (req, res) => {
    try {
        const publicKey = CAInfo.getPublicKey();
        res.json({
            success: true,
            publicKey
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 获取CA完整信息
router.get('/info', (req, res) => {
    try {
        const caInfo = CAInfo.getCAInfo();
        res.json({
            success: true,
            ...caInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;