const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        unique: true,
        sparse: true
    },
    publicKey: {
        type: String,
        unique: true,
        sparse: true
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
    certificate: {
        type: String,
        required: function() {
            return ['MINING_COMPANY', 'CUTTING_COMPANY', 'GRADING_LAB', 'JEWELRY_MAKER'].includes(this.role);
        },
        unique: true,
        sparse: true
    },
    customerId: {
        type: String,
        required: function() {
            return this.role === 'CUSTOMER';
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
    password: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
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