// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiamondRegistry {
    struct Diamond {
        bytes32 infoHash;          // 原石信息哈希
        uint256 timestamp;         // 记录时间
    }
    
    // 存储所有原石信息哈希
    mapping(bytes32 => Diamond) public diamonds;
    // 交易哈希到原石哈希的映射
    mapping(bytes32 => bytes32) public txHashToDiamondHash;
    
    event DiamondRegistered(
        bytes32 indexed infoHash,
        bytes32 indexed transactionHash,
        uint256 timestamp
    );
    
    function registerDiamond(bytes32 _infoHash) public {
        require(diamonds[_infoHash].timestamp == 0, "Diamond already registered");
        
        diamonds[_infoHash] = Diamond({
            infoHash: _infoHash,
            timestamp: block.timestamp
        });
        
        // 使用实际的交易哈希
        bytes32 txHash = bytes32(uint256(uint160(tx.origin)) << 96);
        txHashToDiamondHash[txHash] = _infoHash;
        
        emit DiamondRegistered(_infoHash, txHash, block.timestamp);
    }
    
    // 通过交易哈希查询原石信息
    function getDiamondByTxHash(bytes32 _txHash) public view returns (
        bytes32 infoHash,
        uint256 timestamp,
        bool exists
    ) {
        bytes32 diamondHash = txHashToDiamondHash[_txHash];
        if (diamonds[diamondHash].timestamp == 0) {
            return (bytes32(0), 0, false);
        }
        
        Diamond memory diamond = diamonds[diamondHash];
        return (diamond.infoHash, diamond.timestamp, true);
    }
}