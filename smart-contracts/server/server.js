import express from 'express';
import cors from 'cors';
import { create } from 'ipfs-http-client';
import { CARegistration } from '../lib/CA/CompanyRegistration.js';
import { DiamondManager } from '../lib/DiamondRecord/DiamondManager.js';
import { CertificateVerification } from '../lib/DiamondRecord/verify_success.js';
import { ethers } from 'ethers';
import { NETWORK_CONFIG } from '../config/network.js';
import { CONTRACT_ADDRESS } from '../config/contract.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// IPFS 客户端配置
const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
    timeout: 10000
});

// 初始化以太坊连接
const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.url);
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
    throw new Error("Please set PRIVATE_KEY in .env file");
}

// 创建钱包实例
const wallet = new ethers.Wallet(privateKey, provider);
console.log("Using account:", wallet.address);

// 使用钱包创建合约实例
const contractPath = path.join(__dirname, '../artifacts/contracts/DiamondCertificate.sol/DiamondRegistry.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractJson.abi,
    wallet
);

// 初始化服务类实例
const caRegistration = new CARegistration(ipfs);
const verifier = new CertificateVerification(ethers, contract, ipfs);
const diamondManager = new DiamondManager(contract, verifier);

// 公司注册API
app.post('/api/company/register', async (req, res) => {
    try {
        const { companyName, ethereumAddress, companyType, publicKey } = req.body;

        const registrationRequest = {
            companyName,
            ethereumAddress,
            companyType,
            publicKey
        };

        const result = await caRegistration.issueCertificate(registrationRequest);

        res.json({
            success: true,
            data: {
                ipfsHash: result.ipfsHash,
                certificateHash: result.certificateHash,
                certificate: result.certificate
            }
        });
    } catch (error) {
        console.error('Company registration failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 钻石注册API
app.post('/api/diamond/register', async (req, res) => {
    try {
        const { diamondData, minerSignature, certificateIpfsHash } = req.body;
        
        // 验证并生成哈希
        const verificationResult = await diamondManager.verifyAndHashDiamond(
            diamondData,
            minerSignature,
            certificateIpfsHash
        );

        // 注册到区块链
        const registrationResult = await diamondManager.registerDiamond(verificationResult.infoHash);

        res.json({
            success: true,
            data: registrationResult
        });
    } catch (error) {
        console.error('Diamond registration failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 通过交易哈希查询钻石信息
app.get('/api/diamond/tx/:txHash', async (req, res) => {
    try {
        const { txHash } = req.params;
        
        // 获取交易收据
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt) {
            throw new Error("Transaction not found");
        }

        // 解析事件日志
        const diamondRegisteredTopic = ethers.id("DiamondRegistered(bytes32,uint256)");
        const relevantLog = receipt.logs.find(log => log.topics[0] === diamondRegisteredTopic);
        
        if (!relevantLog) {
            throw new Error("No diamond registration event found in this transaction");
        }

        // 解析事件数据
        const infoHash = relevantLog.topics[1];  // 第一个indexed参数是infoHash
        const timestamp = parseInt(relevantLog.data, 16);  // 非indexed参数是timestamp
        
        res.json({
            success: true,
            data: {
                diamondHash: infoHash,
                registrationTime: new Date(timestamp * 1000).toISOString(),
                transactionHash: txHash
            }
        });
    } catch (error) {
        console.error('Diamond query failed:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});