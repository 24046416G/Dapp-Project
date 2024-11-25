const { Web3 } = require('web3');
require('dotenv').config();

let web3;
let contract = null;

try {
    // 连接到以太坊网络
    web3 = new Web3(process.env.ETHEREUM_NODE_URL || 'http://localhost:8545');
    console.log('Web3 initialized successfully');

    // 智能合约ABI和地址
    const contractData = require('../contracts/DiamondCertificate.json');
    const contractAddress = process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
    
    // 确保直接使用abi数组
    if (Array.isArray(contractData.abi)) {
        contract = new web3.eth.Contract(
            contractData.abi,
            contractAddress,
            {
                from: process.env.DEFAULT_ACCOUNT, // 可选：设置默认发送账户
                gas: process.env.DEFAULT_GAS || 3000000 // 可选：设置默认gas限制
            }
        );
        console.log('Contract initialized successfully');
    } else {
        throw new Error('Invalid ABI format');
    }
} catch (error) {
    console.error('Error initializing Web3 or Contract:', error);
    // 在开发环境中，我们可以继续运行应用，但在生产环境中可能需要处理这个错误
}

module.exports = { web3, contract };
