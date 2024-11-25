//create entity model for diamonds
const mongoose = require('mongoose');

const diamondSchema = new mongoose.Schema({
    diamondId: {
        type: String,
        required: true,
        unique: true
    },
    currentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['MINED', 'CUT', 'CERTIFIED', 'JEWELRY', 'SOLD'],
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    uniqueID: {
        type: String,
    },
    jewelryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jewelry',
        unique: true,
        required: function() {
            return this.status === 'JEWELRY' || this.status === 'SOLD';
        }
    },
    metadata: {
        color: String,
        certificateNumber: String,
        images: String,
    },
    history: [{
        status: String,
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: Date,
        transaction: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Diamond', diamondSchema); 