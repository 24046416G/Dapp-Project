//create entity model for diamonds
const mongoose = require('mongoose');

const diamondSchema = new mongoose.Schema({
    diamondId: {
        type: String,
        required: true,
        unique: true
    },
    diamondType: {
        type: String,
        required: true
    },
    currentOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['MINED', 'CUT', 'GRADED', 'JEWELRY', 'SOLD'],
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    certificates: {
        miningCertificate: {
            companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            certificateHash: String,
            timestamp: Date,
            status: {
                type: String,
                enum: ['PENDING', 'VERIFIED'],
                default: 'PENDING'
            }
        },
        cuttingCertificate: {
            companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            certificateHash: String,
            timestamp: Date,
            status: {
                type: String,
                enum: ['PENDING', 'VERIFIED'],
                default: 'PENDING'
            }
        },
        gradingCertificate: {
            companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            certificateHash: String,
            timestamp: Date,
            status: {
                type: String,
                enum: ['PENDING', 'VERIFIED'],
                default: 'PENDING'
            }
        },
        jewelryCertificate: {
            companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            certificateHash: String,
            timestamp: Date,
            status: {
                type: String,
                enum: ['PENDING', 'VERIFIED'],
                default: 'PENDING'
            }
        }
    },
    jewelryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jewelry',
        sparse: true,
        required: function() {
            return this.status === 'JEWELRY' || this.status === 'SOLD';
        }
    },
    metadata: {
        origin: String,
        color: String,
        carat: Number,
        cut: String,
        polish: String,
        grading: String,
        images: {
            type: String,
            maxLength: 5 * 1024 * 1024  // Allows a maximum 5MB Base64 string
        }
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

// Validation before status change
diamondSchema.pre('save', function(next) {
    if (!this.isModified('status')) {
        return next();
    }

    const validStatusTransitions = {
        'MINED': ['CUT'],
        'CUT': ['GRADED'],
        'GRADED': ['JEWELRY'],
        'JEWELRY': ['SOLD'],
        'SOLD': [] // Terminal state, cannot be changed again
    };

    // If it's a new document and the initial status is MINED, allow
    if (this.isNew && this.status === 'MINED') {
        return next();
    }

    // Get the previous status
    const previousStatus = this._previousStatus || this.status;
    
    // Check if the status transition is valid
    // if (!validStatusTransitions[previousStatus].includes(this.status)) {
    //     return next(new Error(`Invalid status transition from ${previousStatus} to ${this.status}`));
    // }

    // Check if the necessary certificates exist
    const requiredCertificates = {
        'CUT': 'miningCertificate',
        'GRADED': 'cuttingCertificate',
        'JEWELRY': 'gradingCertificate',
        'SOLD': 'jewelryCertificate'
    };

    const requiredCert = requiredCertificates[this.status];
    if (requiredCert && (!this.certificates || !this.certificates[requiredCert] || !this.certificates[requiredCert].certificateHash)) {
        return next(new Error(`${requiredCert} is required for status ${this.status}`));
    }

    // Save the current status for comparison next time
    this._previousStatus = this.status;
    next();
});

// Method to add certificates
diamondSchema.methods.addCertificate = async function(companyId, certificateHash, certificateType) {
    // Validate certificate type
    const validCertTypes = ['miningCertificate', 'cuttingCertificate', 'gradingCertificate', 'jewelryCertificate'];
    if (!validCertTypes.includes(certificateType)) {
        throw new Error('Invalid certificate type');
    }

    // Validate company role
    const company = await mongoose.model('User').findById(companyId);
    if (!company) {
        throw new Error('Company not found');
    }

    const roleMap = {
        'miningCertificate': 'MINING_COMPANY',
        'cuttingCertificate': 'CUTTING_COMPANY',
        'gradingCertificate': 'GRADING_LAB',
        'jewelryCertificate': 'JEWELRY_MAKER'
    };

    if (company.role !== roleMap[certificateType]) {
        throw new Error(`Invalid company role for ${certificateType}`);
    }

    // Update certificate
    if (!this.certificates) {
        this.certificates = {};
    }

    this.certificates[certificateType] = {
        companyId: companyId,
        certificateHash: certificateHash,
        timestamp: new Date(),
        status: 'VERIFIED'
    };

    // Add to history
    this.history.push({
        status: this.status,
        owner: this.currentOwner,
        timestamp: new Date(),
        transaction: certificateHash
    });

    return this.save();
};

// Method to verify certificates
diamondSchema.methods.verifyCertificate = async function(certificateType) {
    if (!this.certificates || !this.certificates[certificateType]) {
        return false;
    }

    const cert = this.certificates[certificateType];
    const company = await mongoose.model('User').findById(cert.companyId);
    if (!company) {
        return false;
    }

    return cert.status === 'VERIFIED';
};

module.exports = mongoose.model('Diamond', diamondSchema); 