// 脚本生成RSA公私钥对，并写入.env文件

import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 生成 RSA 密钥对
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

// 准备要追加的内容，包含注释
const envContent = `
# CA Root Keys (Generated at ${new Date().toISOString()})
# Private key for signing certificates - KEEP THIS SECRET!
ROOT_CA_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"

# Public key for verifying certificates - This can be shared
ROOT_CA_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"
`;

// 构建.env文件的完整路径
const envPath = path.join(__dirname, '../.env');

// 检查文件是否存在，如果存在则追加，不存在则创建
if (fs.existsSync(envPath)) {
    // 先读取现有内容，检查是否已经包含 CA keys
    const existingContent = fs.readFileSync(envPath, 'utf8');
    if (!existingContent.includes('ROOT_CA_PRIVATE_KEY') && !existingContent.includes('ROOT_CA_PUBLIC_KEY')) {
        // 追加新内容
        fs.appendFileSync(envPath, envContent);
        console.log('CA keys have been appended to existing .env file');
    } else {
        console.log('CA keys already exist in .env file. Skipping...');
    }
} else {
    // 创建新文件
    fs.writeFileSync(envPath, envContent.trim());
    console.log('Created new .env file with CA keys');
}

console.log('\nGenerated CA Keys:');
console.log('\nPrivate Key:');
console.log(privateKey);
console.log('\nPublic Key:');
console.log(publicKey);