const mongoose = require('mongoose');
const ethUtil = require('ethereumjs-util');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    privateKey: {
        type: String,
        required: true,
        unique: true
    },
    publicKey: {
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

// 生成密钥对和钱包地址的方法
userSchema.methods.generateWallet = function() {
    // 生成随机的私钥 (32 bytes)
    const privateKeyBuffer = crypto.randomBytes(32);
    const privateKeyHex = privateKeyBuffer.toString('hex');
    
    // 从私钥生成公钥
    const publicKeyBuffer = ethUtil.privateToPublic(privateKeyBuffer);
    const publicKeyHex = publicKeyBuffer.toString('hex');
    
    // 从公钥生成地址 (取最后20字节并加上'0x'前缀)
    const addressBuffer = ethUtil.publicToAddress(publicKeyBuffer);
    const walletAddress = '0x' + addressBuffer.toString('hex');
    
    this.privateKey = privateKeyHex;
    this.publicKey = publicKeyHex;
    this.walletAddress = walletAddress;
};

// 在保存前生成钱包
userSchema.pre('save', function(next) {
    if (!this.walletAddress) {
        this.generateWallet();
    }
    next();
});

// 验证签名的方法
userSchema.methods.verifySignature = function(message, signature) {
    try {
        // 将消息转换为Buffer并计算其Keccak256哈希
        const messageBuffer = Buffer.from(message);
        const messageHash = ethUtil.keccak256(messageBuffer);
        
        // 从签名中恢复公钥
        const signatureBuffer = ethUtil.toBuffer(signature);
        const { v, r, s } = ethUtil.fromRpcSig(signatureBuffer);
        const recoveredPublicKey = ethUtil.ecrecover(messageHash, v, r, s);
        const recoveredAddress = '0x' + ethUtil.publicToAddress(recoveredPublicKey).toString('hex');
        
        // 验证恢复的地址是否匹配
        return recoveredAddress.toLowerCase() === this.walletAddress.toLowerCase();
    } catch (error) {
        return false;
    }
};

// 签名消息的方法
userSchema.methods.signMessage = function(message) {
    const messageBuffer = Buffer.from(message);
    const messageHash = ethUtil.keccak256(messageBuffer);
    const privateKeyBuffer = Buffer.from(this.privateKey, 'hex');
    const signature = ethUtil.ecsign(messageHash, privateKeyBuffer);
    return ethUtil.toRpcSig(signature.v, signature.r, signature.s);
};

module.exports = mongoose.model('User', userSchema); 