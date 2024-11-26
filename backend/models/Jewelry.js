const mongoose = require('mongoose');

const jewelrySchema = new mongoose.Schema({
    jewelryId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    authenticityCertificate: {
        type: String,  // IPFS哈希
    },
    diamonds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diamond',
        required: true
    }],
    currentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await mongoose.model('User').findById(value);
                return user.role === 'JEWELRY_MAKER' || user.role === 'CUSTOMER';
            },
            message: 'Jewelry can only be owned by Jewelry Makers or Customers'
        }
    },
    price: {
        type: Number,
        required: true
    },
    metadata: {
        images: String,
        certificateHash: String
    },
    history: [{
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: String,
        timestamp: Date,
        transaction: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Jewelry', jewelrySchema); 