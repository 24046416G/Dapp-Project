import crypto from 'crypto';
import CAInfo from '../CA/CAinfo.js';
import { ethers } from 'ethers';

export class CertificateVerification111 {
    constructor(web3, contract, ipfs) {
        this.web3 = web3;
        this.contract = contract;
        this.ipfs = ipfs;
    }

    async verifyDiamondRegistration(diamondData, minerSignature, certificateIpfsHash) {
        try {
            // 1. 验证挖矿公司的证书
            const isCompanyValid = await this.verifyCompanyCertificate(certificateIpfsHash);
            if (!isCompanyValid) {
                throw new Error("Company certificate is invalid");
            }

            // 2. 从IPFS获取证书内容
            const chunks = [];
            for await (const chunk of this.ipfs.cat(certificateIpfsHash)) {
                chunks.push(chunk);
            }
            const certificateBuffer = Buffer.concat(chunks);
            const certificate = JSON.parse(certificateBuffer.toString());

            // 3. 验证证书是否过期
            const expiresAt = new Date(certificate.metadata.expiresAt);
            if (expiresAt < new Date()) {
                throw new Error("Company certificate has expired");
            }

            // 4. 验证公司类型是否为MINER
            if (certificate.companyInfo.type !== "MINER") {
                throw new Error("Company is not authorized for mining operations");
            }

            // 5. 验证原石信息签名
            const diamondDataString = JSON.stringify(diamondData);
            const messageHash = ethers.keccak256(ethers.toUtf8Bytes(diamondDataString));
            
            const verify = crypto.createVerify('RSA-SHA256');
            verify.update(messageHash.slice(2));
            
            const isSignatureValid = verify.verify(
                certificate.companyInfo.publicKey,
                minerSignature,
                'base64'
            );

            if (!isSignatureValid) {
                throw new Error("Invalid diamond data signature");
            }

            return {
                isValid: true,
                companyAddress: certificate.companyInfo.address,
                companyName: certificate.companyInfo.name
            };

        } catch (error) {
            console.error('Diamond registration verification failed:', error);
            return {
                isValid: false,
                error: error.message
            };
        }
    }

    async verifyCompanyCertificate(ipfsHash) {
        try {
            // 1. 从IPFS获取证书内容
            const chunks = [];
            for await (const chunk of this.ipfs.cat(ipfsHash)) {
                chunks.push(chunk);
            }
            const certificateBuffer = Buffer.concat(chunks);
            
            // 添加调试信息
            console.log("Raw IPFS data:", certificateBuffer.toString());
            
            // 确保数据是字符串格式并解析 JSON
            const certificateString = certificateBuffer.toString('utf8');
            let certificate;
            try {
                certificate = JSON.parse(certificateString);
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                console.log("Attempted to parse:", certificateString);
                return false;
            }
            
            // 2. 计算证书内容的哈希
            const certificateContent = {
                companyInfo: certificate.companyInfo,
                metadata: certificate.metadata
            };
            
            console.log("Certificate Content for Hash:", certificateContent);
            
            const calculatedHash = crypto
                .createHash('sha256')
                .update(JSON.stringify(certificateContent))
                .digest('hex');
                
            // 3. 获取CA公钥
            const caPublicKey = CAInfo.getPublicKey();
            console.log("Using CA Public Key:", caPublicKey);
            
            // 4. 验证CA签名
            const verify = crypto.createVerify('RSA-SHA256');
            verify.update(calculatedHash);
            
            const isSignatureValid = verify.verify(
                caPublicKey,
                certificate.signature,
                'base64'
            );
            
            console.log("Calculated Hash:", calculatedHash);
            console.log("Certificate Hash:", certificate.certificateHash);
            console.log("Signature Valid:", isSignatureValid);
            
            if (!isSignatureValid) {
                console.error("Signature verification failed");
                return false;
            }
            
            if (calculatedHash !== certificate.certificateHash) {
                console.error("Hash mismatch");
                return false;
            }
            
            return true;
            
        } catch (error) {
            console.error('Certificate verification failed:', error);
            return false;
        }
    }
}

module.exports = { CertificateVerification111 };