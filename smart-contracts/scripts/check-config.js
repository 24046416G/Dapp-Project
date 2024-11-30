import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function checkConfig() {
    console.log("=== Checking Configuration ===\n");

    // 检查 .env 文件
    const envPath = path.join(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        console.error("Error: .env file not found!");
        console.log("Please run: npm run init");
        process.exit(1);
    }

    // 加载环境变量
    dotenv.config();

    // 检查必要的环境变量
    const requiredEnvVars = [
        'PRIVATE_KEY',
        'ROOT_CA_PRIVATE_KEY',
        'ROOT_CA_PUBLIC_KEY'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        console.error("Error: Missing required environment variables:");
        missingVars.forEach(varName => console.error(`- ${varName}`));
        console.log("\nPlease run: npm run init");
        process.exit(1);
    }

    // 检查合约地址配置
    const contractConfigPath = path.join(__dirname, '../config/contract.js');
    if (!fs.existsSync(contractConfigPath)) {
        console.error("Error: Contract configuration file not found!");
        console.log("Please run: npm run init");
        process.exit(1);
    }

    console.log("✓ All configurations are present");
    console.log("\nCurrent Configuration:");
    console.log("- Network URL:", process.env.NETWORK_URL);
    
    // 修改这一行，从使用 require 改为使用 import
    const { CONTRACT_ADDRESS } = await import('../config/contract.js');
    console.log("- Contract Address:", CONTRACT_ADDRESS);
}

checkConfig();