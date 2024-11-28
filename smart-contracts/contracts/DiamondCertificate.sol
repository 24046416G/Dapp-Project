// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DiamondRegistry {
    struct Diamond {
        bytes32 infoHash;          // 原石信息哈希（包含了所有信息的哈希）
        uint256 timestamp;         // 记录时间
    }
    
    // 存储所有原石信息哈希
    mapping(bytes32 => Diamond) public diamonds;
    
    // 事件
    event DiamondRegistered(
        bytes32 indexed infoHash,
        uint256 timestamp
    );
    
    // 记录原石信息哈希
    function registerDiamond(bytes32 _infoHash) public {
        require(diamonds[_infoHash].timestamp == 0, "Diamond already registered");
        
        diamonds[_infoHash] = Diamond({
            infoHash: _infoHash,
            timestamp: block.timestamp
        });
        
        emit DiamondRegistered(_infoHash, block.timestamp);
    }
    
    // 查询原石记录时间
    function getDiamondTimestamp(bytes32 _infoHash) public view returns (uint256) {
        return diamonds[_infoHash].timestamp;
    }
}