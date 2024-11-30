import { ethers } from 'ethers';
import fs from 'fs';

import { create } from 'ipfs-http-client';
import { CertificateVerification } from '../lib/DiamondRecord/verify_success.js';
import { DiamondManager } from '../lib/DiamondRecord/DiamondManager.js';
import { NETWORK_CONFIG } from '../config/network.js';

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
    
    // 获取 Ganache 的测试账户
    const accounts = await provider.listAccounts();
    // 使用第一个测试账户的私钥（这是 Ganache 默认的第一个账户）
    const privateKey = "0xf8be79e123792c0d8f21bce55e989fde3f373cec78733bc9d2793434bf65f636"; // Ganache 默认的第一个账户私钥
    const wallet = new ethers.Wallet(privateKey, provider);

    console.log("Using account:", wallet.address);

    const contractPath = './artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json';

    // 读取合约 ABI 和 Bytecode
    const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    
    // 使用已部署的合约地址
    const contractAddress = '0x5f39BEC750B2A740A06215fC7B3f5C5Da36E0a57'; // 替换为实际的合约地址
    console.log("\nUsing deployed contract at:", contractAddress);

    // 创建一个新的合约实例
    const diamondContract = new ethers.Contract(
        contractAddress,
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