import 'dotenv/config';
import { ethers } from 'ethers';
import { NETWORK_CONFIG } from '../config/network.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

// 首先初始化 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 然后再定义 contractPath
const contractPath = path.join(__dirname, '../artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json');

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
    throw new Error("Please set the PRIVATE_KEY in .env file");
}

async function main() {
    try {
        // 连接到 Ganache
        const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.url);
        
        // 使用私钥创建钱包
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        console.log("Deploying contracts with account:", wallet.address);

        // 读取合约 ABI 和 Bytecode
        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

        // 部署合约
        const factory = new ethers.ContractFactory(
            contractJson.abi,
            contractJson.bytecode,
            wallet
        );

        console.log("Deploying contract...");
        const contract = await factory.deploy();
        await contract.waitForDeployment();

        const contractAddress = await contract.getAddress();
        console.log("DiamondRegistry deployed to:", contractAddress);

        // 保存合约地址到配置文件
        const configContent = `export const CONTRACT_ADDRESS = '${contractAddress}';\n`;
        const configPath = path.join(__dirname, '../config/contract.js');
        fs.writeFileSync(configPath, configContent);

        console.log("Contract address saved to config file");

    } catch (error) {
        console.error("Deployment failed:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });