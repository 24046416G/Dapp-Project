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
            maxLength: 5 * 1024 * 1024  // 允许最大 5MB 的 Base64 字符串
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

// 状态变更前的验证
diamondSchema.pre('save', function(next) {
    if (!this.isModified('status')) {
        return next();
    }

    const validStatusTransitions = {
        'MINED': ['CUT'],
        'CUT': ['GRADED'],
        'GRADED': ['JEWELRY'],
        'JEWELRY': ['SOLD'],
        'SOLD': [] // 终态，不能再改变
    };

    // 如果是新文档，且初始状态为MINED，允许
    if (this.isNew && this.status === 'MINED') {
        return next();
    }

    // 获取之前的状态
    const previousStatus = this._previousStatus || this.status;
    
    // 检查状态转换是否有效
    // if (!validStatusTransitions[previousStatus].includes(this.status)) {
    //     return next(new Error(`Invalid status transition from ${previousStatus} to ${this.status}`));
    // }

    // 检查必要的证书是否存在
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

    // 保存当前状态用于下次比较
    this._previousStatus = this.status;
    next();
});

// 添加证书的方法
diamondSchema.methods.addCertificate = async function(companyId, certificateHash, certificateType) {
    // 验证证书类型
    const validCertTypes = ['miningCertificate', 'cuttingCertificate', 'gradingCertificate', 'jewelryCertificate'];
    if (!validCertTypes.includes(certificateType)) {
        throw new Error('Invalid certificate type');
    }

    // 验证公司角色
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

    // 更新证书
    if (!this.certificates) {
        this.certificates = {};
    }

    this.certificates[certificateType] = {
        companyId: companyId,
        certificateHash: certificateHash,
        timestamp: new Date(),
        status: 'VERIFIED'
    };

    // 添加到历史记录
    this.history.push({
        status: this.status,
        owner: this.currentOwner,
        timestamp: new Date(),
        transaction: certificateHash
    });

    return this.save();
};

// 验证证书的方法
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