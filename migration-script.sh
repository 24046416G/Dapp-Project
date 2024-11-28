#!/bin/bash

# 创建目录结构
mkdir -p smart-contracts/lib/{CA,DiamondRecord}
mkdir -p smart-contracts/config
mkdir -p smart-contracts/scripts
mkdir -p smart-contracts/test

# 复制并转换文件
# 配置文件
cp backend/config/CA.js smart-contracts/config/
cp backend/config/contract.js smart-contracts/config/
cp backend/config/network.js smart-contracts/config/

# CA 相关文件
cp backend/lib/CA/CAinfo.js smart-contracts/lib/CA/
cp backend/lib/CA/CARegistration.js smart-contracts/lib/CA/

# Diamond 相关文件
cp backend/lib/DiamondRecord/DiamondManager.js smart-contracts/lib/DiamondRecord/
cp backend/lib/DiamondRecord/verify_success.js smart-contracts/lib/DiamondRecord/
cp backend/lib/DiamondRecord/Verify.js smart-contracts/lib/DiamondRecord/

# 脚本文件
cp backend/scripts/deploy-ganache.js smart-contracts/scripts/
cp backend/scripts/generateCAKeys.js smart-contracts/scripts/
cp backend/scripts/test-registration.js smart-contracts/scripts/
cp backend/scripts/test-query.js smart-contracts/scripts/

# 测试文件
cp backend/test/caRegistration.test.js smart-contracts/test/

# 复制环境变量文件
cp backend/.env smart-contracts/

# 更新 package.json
echo '{
  "name": "smart-contracts",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "node test/caRegistration.test.js",
    "deploy": "node scripts/deploy-ganache.js",
    "generate-keys": "node scripts/generateCAKeys.js",
    "test-registration": "node scripts/test-registration.js",
    "test-query": "node scripts/test-query.js"
  },
  "dependencies": {
    "@nomicfoundation/hardhat-toolbox": "^5.0.0",
    "@openzeppelin/contracts": "^5.1.0",
    "crypto": "^1.0.1",
    "dotenv": "^16.4.5",
    "ethers": "^6.11.1",
    "hardhat": "^2.22.16",
    "ipfs-http-client": "^60.0.1"
  }
}' > smart-contracts/package.json

# 更新 hardhat.config.js
echo 'import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [process.env.PRIVATE_KEY || ""]
    }
  }
};

export default config;' > smart-contracts/hardhat.config.js

# 安装依赖
cd smart-contracts
npm install

# 给脚本执行权限
chmod +x scripts/*.js

echo "迁移完成！请检查文件并运行 npm install"