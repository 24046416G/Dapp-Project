import crypto from 'crypto';
import { CAInfo } from './CAinfo.js';
import dotenv from 'dotenv';

dotenv.config();

export class CARegistration {
    constructor(ipfs) {
        this.ipfs = ipfs;
    }

    async issueCertificate(registrationRequest) {
        try {
            // 1. 验证请求数据
            this.validateRequest(registrationRequest);

            // 2. 准备证书内容
            const certificateContent = {
                companyInfo: {
                    name: registrationRequest.companyName,
                    address: registrationRequest.ethereumAddress,
                    type: registrationRequest.companyType,
                    publicKey: registrationRequest.publicKey,
                    registrationDate: new Date().toISOString()
                },
                metadata: {
                    version: "1.0",
                    issuer: CAInfo.getCAInfo().issuer,
                    issuedAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
                }
            };

            // 3. 计算证书哈希
            const certificateHash = crypto
                .createHash('sha256')
                .update(JSON.stringify(certificateContent))
                .digest('hex');

            // 4. CA签名
            const sign = crypto.createSign('RSA-SHA256');
            sign.update(certificateHash);
            const signature = sign.sign(process.env.ROOT_CA_PRIVATE_KEY, 'base64');

            // 5. 创建完整证书
            const certificate = {
                ...certificateContent,
                certificateHash,
                signature
            };

            // 6. 上传到IPFS
            const certificateBuffer = Buffer.from(JSON.stringify(certificate));
            const { cid } = await this.ipfs.add(certificateBuffer, {
                pin: true,
                timeout: 10000
            });

            return {
                certificateHash,
                signature,
                ipfsHash: cid.toString(),
                certificate
            };

        } catch (error) {
            console.error('Certificate issuance failed:', error);
            throw error;
        }
    }

    validateRequest(request) {
        if (!request.companyName) throw new Error('Company name is required');
        if (!request.ethereumAddress) throw new Error('Ethereum address is required');
        if (!request.companyType) throw new Error('Company type is required');
        if (!request.publicKey) throw new Error('Company public key is required');
        
        // 验证以太坊地址格式
        if (!/^0x[a-fA-F0-9]{40}$/.test(request.ethereumAddress)) {
            throw new Error('Invalid Ethereum address format');
        }

        // 验证公钥格式
        if (!request.publicKey.includes('BEGIN PUBLIC KEY')) {
            throw new Error('Invalid public key format');
        }
    }
}

