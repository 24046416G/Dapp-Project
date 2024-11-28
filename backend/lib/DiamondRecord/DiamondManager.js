import { CertificateVerification } from './verify_success.js';
import { ethers } from 'ethers';

export class DiamondManager {
    constructor(contract, certificateVerifier) {
        this.contract = contract;
        this.verifier = certificateVerifier;
        this.localDiamondStorage = new Map();
        this.txHashMapping = new Map();
    }
    
    async verifyAndHashDiamond(diamondData, minerSignature, certificateIpfsHash) {
        try {
            const verificationResult = await this.verifier.verifyDiamondRegistration(
                diamondData,
                minerSignature,
                certificateIpfsHash
            );

            if (!verificationResult.isValid) {
                throw new Error(verificationResult.error || "Verification failed");
            }

            const fullDiamondInfo = {
                ...diamondData,
                companyName: verificationResult.companyName,
                companyAddress: verificationResult.companyAddress,
                verifiedAt: new Date().toISOString()
            };

            const infoHash = ethers.keccak256(
                ethers.toUtf8Bytes(JSON.stringify(fullDiamondInfo))
            );

            this.localDiamondStorage.set(infoHash, fullDiamondInfo);

            return {
                success: true,
                infoHash,
                fullDiamondInfo
            };
        } catch (error) {
            console.error("Diamond verification failed:", error);
            throw error;
        }
    }
    
    async registerDiamond(infoHash) {
        try {
            const tx = await this.contract.registerDiamond(infoHash);
            const receipt = await tx.wait();
            
            this.txHashMapping.set(receipt.hash, infoHash);
            
            return {
                success: true,
                transactionHash: receipt.hash,
                diamondHash: infoHash
            };
        } catch (error) {
            console.error("Diamond registration failed:", error);
            throw error;
        }
    }

    async getDiamondByTxHash(txHash) {
        try {
            const diamondHash = this.txHashMapping.get(txHash);
            if (!diamondHash) {
                throw new Error("Transaction hash not found in local storage");
            }
            
            const isRegistered = await this.contract.isDiamondRegistered(diamondHash);
            if (!isRegistered) {
                throw new Error("Diamond not found on blockchain");
            }

            const diamondInfo = this.localDiamondStorage.get(diamondHash);
            
            return {
                success: true,
                diamondHash,
                isRegistered,
                diamondInfo,
                transactionHash: txHash
            };
        } catch (error) {
            console.error("Failed to get diamond by transaction hash:", error);
            throw error;
        }
    }

    async getDiamondByHash(diamondHash) {
        try {
            const isRegistered = await this.contract.isDiamondRegistered(diamondHash);
            if (!isRegistered) {
                throw new Error("Diamond not found on blockchain");
            }

            const diamondInfo = this.localDiamondStorage.get(diamondHash);
            if (!diamondInfo) {
                throw new Error("Diamond details not found in local storage");
            }

            return {
                success: true,
                diamondHash,
                isRegistered,
                diamondInfo
            };
        } catch (error) {
            console.error("Failed to get diamond by hash:", error);
            throw error;
        }
    }
}

