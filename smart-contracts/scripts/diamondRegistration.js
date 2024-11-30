import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import { NETWORK_CONFIG } from '../config/network.js';
import { CONTRACT_ADDRESS } from '../config/contract.js';

dotenv.config();

async function main() {
    console.log("=== Starting Diamond Registration Test ===\n");

    // 1. 连接到本地IPFS
    const ipfs = create({
        host: 'localhost',
        port: 5001,
        protocol: 'http'
    });

    // 2. 连接到 Ganache
    const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.url);
    
    // 从环境变量获取私钥
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Please set PRIVATE_KEY in .env file");
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    console.log("Using account:", wallet.address);

    // 使用配置文件中的合约地址
    console.log("\nUsing deployed contract at:", CONTRACT_ADDRESS);

    // 读取合约 ABI 和 Bytecode
    const contractPath = './artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json';
    const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

    // 创建一个新的合约实例
    const diamondContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractJson.abi,
        wallet
    );

    // 3. 创建验证器和管理器实例
    const verifier = new CertificateVerification(ethers, diamondContract, ipfs);
    const diamondManager = new DiamondManager(diamondContract, verifier);

    try {
        // 1. 准备钻石数据
        const testDiamondData = {
            id: "D123456",
            carat: "2.5",
            color: "D",
            clarity: "VVS1",
            origin: "South Africa",
            miningDate: new Date().toISOString()
        };

        console.log("\n=== Test Data ===");
        console.log("Diamond Data:", testDiamondData);

        // 2. 生成信息哈希
        const infoHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(testDiamondData)));
        console.log("Diamond Info Hash:", infoHash);

        // 3. 注册到区块链
        console.log("\n=== Registering on Blockchain ===");
        const tx = await diamondContract.registerDiamond(infoHash);
        const receipt = await tx.wait();
        console.log("Registration Transaction Hash:", receipt.hash);

    } catch (error) {
        console.error("\nTest failed:", error);
        console.error(error.stack);
    }

    console.log("\n=== Test completed! ===");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });