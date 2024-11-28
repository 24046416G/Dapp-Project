import { create } from 'ipfs-http-client';
import { CARegistration } from '../lib/CA/CARegistration.js';
import { CAInfo } from '../lib/CA/CAinfo.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 配置 dotenv
dotenv.config({ path: path.join(__dirname, '../../.env') });

// IPFS 客户端配置
const ipfs = create({
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http',
    timeout: 10000
});

async function testCARegistration() {
    try {
        console.log("=== Starting CA Registration Test ===\n");

        // 1. 生成测试用的公司密钥对
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // 2. 准备注册请求
        const registrationRequest = {
            companyName: "Diamond Company A",
            ethereumAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            companyType: "MINER",
            publicKey: publicKey
        };

        // 3. 初始化CA注册服务
        const caRegistration = new CARegistration(ipfs);

        // 4. 签发证书
        console.log("Issuing certificate...");
        const result = await caRegistration.issueCertificate(registrationRequest);

        // 5. 打印结果
        console.log("\n=== Certificate Details ===");
        console.log("IPFS Hash:", result.ipfsHash);
        console.log("Certificate Hash:", result.certificateHash);
        console.log("\nCertificate Content:");
        console.log(JSON.stringify(result.certificate, null, 2));

        // 6. 提供查看链接
        console.log("\n=== View Certificate ===");
        console.log("Local Gateway:", `http://localhost:8080/ipfs/${result.ipfsHash}`);
        console.log("IPFS Desktop: Open IPFS Desktop and search for:", result.ipfsHash);
        console.log("Public Gateway:", `https://ipfs.io/ipfs/${result.ipfsHash}`);

    } catch (error) {
        console.error("\nTest failed:", error);
        console.error(error.stack);
    }
}

// 运行测试
testCARegistration().then(() => {
    console.log("\n=== Test completed! ===");
}).catch(error => {
    console.error("\nTest failed:", error);
});