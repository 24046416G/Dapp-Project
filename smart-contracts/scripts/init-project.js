import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建命令行交互接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 封装 readline 的 question 方法为 Promise
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function initProject() {
    console.log("=== Initializing Project ===\n");

    try {
        // 1. 连接到 Ganache
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
        
        // 3. 获取 Ganache 的账户列表
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
            throw new Error("No accounts found in Ganache. Please ensure Ganache is running.");
        }
        
        // 获取第一个账户地址
        const address = accounts[0];
        console.log("Found Ganache account:", address);

        // 4. 获取账户余额
        const balance = await provider.getBalance(address);
        console.log("Account balance:", ethers.formatEther(balance), "ETH");

        // 5. 提示用户输入私钥
        console.log("\nPlease open Ganache UI and copy the private key for this address:");
        console.log("1. Click on the key icon next to the account");
        console.log("2. Copy the private key (including 0x prefix)");
        const privateKey = await question("Enter the private key: ");
        
        // 验证私钥格式
        if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
            throw new Error("Invalid private key format. It should start with '0x' and be 64 characters long (plus 0x prefix)");
        }


        // 5. 生成 CA 密钥对
        const { publicKey, privateKey: caPrivateKey } = crypto.generateKeyPairSync('rsa', {
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

        // 更新 CA.js 配置文件
        const caConfig = `// CA的公钥配置
export const CA_CONFIG = {
    publicKey: \`${publicKey}\`,
    algorithm: "RSA-SHA256",
    version: "1.0",
    issuer: "DiamondChainRootCA"
};
`;
        fs.writeFileSync(
            path.join(__dirname, '../config/CA.js'),
            caConfig
        );
        console.log("Updated CA configuration");

        // 6. 创建 .env 文件
        const envPath = path.join(__dirname, '../.env');
        const envContent = `
# Ganache Account (Generated at ${new Date().toISOString()})
PRIVATE_KEY="${privateKey}"

# CA Root Key
ROOT_CA_PRIVATE_KEY="${caPrivateKey.replace(/\n/g, '\\n')}"

# Network Configuration
NETWORK_URL="http://127.0.0.1:7545"
CHAIN_ID=1337
`;

        fs.writeFileSync(envPath, envContent.trim());
        console.log("\nCreated .env file with account and CA information");

        // 7. 编译智能合约
        console.log("\nCompiling smart contracts...");
        const { exec } = await import('child_process');
        const util = await import('util');
        const execPromise = util.promisify(exec);

        try {
            await execPromise('npx hardhat compile');
            console.log("Smart contracts compiled successfully");
        } catch (error) {
            throw new Error(`Contract compilation failed: ${error.message}`);
        }

        // 检查编译后的文件是否存在
        const artifactPath = path.join(__dirname, '../artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json');
        if (!fs.existsSync(artifactPath)) {
            throw new Error("Contract artifact not found. Compilation may have failed.");
        }

        // 8. 更新 network.js 配置
        const networkConfig = `export const NETWORK_CONFIG = {
    url: "http://127.0.0.1:7545",
    chainId: 1337
};
`;
        fs.writeFileSync(
            path.join(__dirname, '../config/network.js'),
            networkConfig
        );

        // 9. 部署合约
        console.log("\nDeploying contract...");
        const deployResult = await deployContract(provider, privateKey);
        
        // 10. 更新 contract.js 配置
        const contractConfig = `export const CONTRACT_ADDRESS = '${deployResult.address}';\n`;
        fs.writeFileSync(
            path.join(__dirname, '../config/contract.js'),
            contractConfig
        );

        console.log("\n=== Initialization Complete ===");
        console.log("Contract deployed at:", deployResult.address);
        console.log("\nYou can now start the server with: npm start");

    } catch (error) {
        console.error("\nInitialization failed:", error);
        process.exit(1);
    } finally {
        rl.close();
    }
}

async function deployContract(provider, privateKey) {
    // 部署合约的逻辑
    const contractPath = path.join(__dirname, '../artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json');
    const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    
    const wallet = new ethers.Wallet(privateKey, provider);
    const factory = new ethers.ContractFactory(
        contractJson.abi,
        contractJson.bytecode,
        wallet
    );

    const contract = await factory.deploy();
    await contract.waitForDeployment();
    
    return {
        address: await contract.getAddress(),
        contract
    };
}

// 运行初始化
initProject().catch(console.error);