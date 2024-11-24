const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['MINING_COMPANY', 'CUTTING_COMPANY', 'GRADING_LAB', 'JEWELRY_MAKER', 'CUSTOMER'],
        required: true
    },
    companyName: {
        type: String,
        required: function() {
            return this.role !== 'CUSTOMER';
        }
    },
    companyId: {
        type: String,
        required: function() {
            return this.role !== 'CUSTOMER';
        },
        unique: true,
        sparse: true
    },
    customerName: {
        type: String,
        required: function() {
            return this.role === 'CUSTOMER';
        }
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    ownedDiamonds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diamond'
    }],
    ownedJewelries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jewelry'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 