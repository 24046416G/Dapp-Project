import { CA_CONFIG } from '../../config/CA.js';

export class CAInfo {
    constructor() {
        this.publicKey = CA_CONFIG.publicKey;
        this.algorithm = CA_CONFIG.algorithm;
        this.version = CA_CONFIG.version;
        this.issuer = CA_CONFIG.issuer;
    }

    static getPublicKey() {
        return CA_CONFIG.publicKey;
    }

    static getCAInfo() {
        return {
            publicKey: CA_CONFIG.publicKey,
            algorithm: CA_CONFIG.algorithm,
            version: CA_CONFIG.version,
            issuer: CA_CONFIG.issuer
        };
    }

    static validatePublicKey(publicKey) {
        try {
            const pemRegex = /^-----BEGIN PUBLIC KEY-----\n[\s\S]*\n-----END PUBLIC KEY-----$/;
            return pemRegex.test(publicKey);
        } catch (error) {
            return false;
        }
    }
}

