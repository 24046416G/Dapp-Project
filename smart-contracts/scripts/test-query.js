import { ethers } from 'ethers';
import fs from 'fs';

// 读取合约 ABI
const contractPath = './artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json';
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

async function main() {
    console.log("=== Querying Diamond by Transaction Hash ===\n");

    const txHash = '0x420f76f26bf48d08b489ae0a65f2abb6694c0e96008a3cfadaf3b48231041de9';
    console.log("Transaction Hash:", txHash);

    try {
        // 连接到 Ganache
        const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
        
        // 获取交易收据
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            throw new Error("Transaction not found");
        }

        // 从事件日志中解析原石哈希
        const diamondRegisteredTopic = ethers.id("DiamondRegistered(bytes32,uint256)");
        const relevantLog = receipt.logs.find(log => log.topics[0] === diamondRegisteredTopic);
        
        if (!relevantLog) {
            throw new Error("No diamond registration event found in this transaction");
        }

        // 解析事件数据
        const infoHash = relevantLog.topics[1];  // 第一个indexed参数
        const eventTxHash = relevantLog.topics[2];  // 第二个indexed参数
        
        // timestamp 在 data 中，因为它是非索引参数
        const timestamp = parseInt(relevantLog.data.slice(2), 16);  // 移除 '0x' 前缀并解析

        console.log("\nQuery Result:");
        console.log("Diamond Hash:", infoHash);
        
        // 显示时间戳
        if (timestamp && timestamp > 0) {
            const date = new Date(timestamp * 1000);
            console.log("Registration Time:", date.toLocaleString());
            console.log("Timestamp (raw):", timestamp);
        } else {
            console.log("No valid timestamp found");
        }

        // 直接从事件日志中获取信息，假设事件日志是可信的
        const exists = timestamp > 0;
        console.log("Exists:", exists);

    } catch (error) {
        console.error("\nQuery failed:", error);
        console.error("Error details:", error.message);
    }
}

main().catch(console.error);