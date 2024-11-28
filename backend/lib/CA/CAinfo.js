import { CA_CONFIG } from '../../config/CA.js';

export class CAInfo {
    constructor() {
        this.publicKey = CA_CONFIG.publicKey;
        this.algorithm = CA_CONFIG.algorithm;
        this.version = CA_CONFIG.version;
        this.issuer = CA_CONFIG.issuer;
    }

    // 获取CA公钥
    static getPublicKey() {
        return CA_CONFIG.publicKey;
    }

    // 获取CA完整信息
    static getCAInfo() {
        return {
            publicKey: CA_CONFIG.publicKey,
            algorithm: CA_CONFIG.algorithm,
            version: CA_CONFIG.version,
            issuer: CA_CONFIG.issuer
        };
    }

    // 验证CA公钥格式
    static validatePublicKey(publicKey) {
        try {
            // 验证公钥格式
            const pemRegex = /^-----BEGIN PUBLIC KEY-----\n[\s\S]*\n-----END PUBLIC KEY-----$/;
            return pemRegex.test(publicKey);
        } catch (error) {
            return false;
        }
    }
}

