import React, { useState } from 'react';
import { FaSync } from 'react-icons/fa';
import '../../css/availableStones.css';

const mockStones = [
    {
        id: 1,
        mineralType: 'Raw Diamond',
        mineLocation: 'Kimberley, South Africa',
        mineDate: '2024-03-15',
        weight: 2.5,
        quality: 'High',
        status: 'Available',
        batchNumber: 'KMB-2024-001',
        minerName: 'ABC Mining Corp'
    },
    {
        id: 2,
        mineralType: 'Raw Diamond',
        mineLocation: 'Jwaneng, Botswana',
        mineDate: '2024-03-14',
        weight: 1.8,
        quality: 'Medium',
        status: 'Available',
        batchNumber: 'JWN-2024-045',
        minerName: 'XYZ Minerals'
    }
];

const AvailableStones = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [stones, setStones] = useState(mockStones);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRefresh = () => {
        // 将来可以添加刷新逻辑
        console.log('Refresh clicked');
    };

    const filteredStones = stones.filter((stone) => {
        return (
            stone.mineralType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stone.mineLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stone.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stone.minerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="available-stones-container">
            <div className="stones-header">
                <div className="header-content">
                    <div>
                        <h2>Available Stones for Cutting</h2>
                        <p>Browse and select stones for cutting process</p>
                    </div>
                    <button 
                        className="refresh-button"
                        onClick={handleRefresh}
                    >
                        <FaSync /> Refresh
                    </button>
                </div>
            </div>

            <div className="stones-filters">
                <input
                    type="text"
                    placeholder="Search by type, location, batch number, or miner..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </div>

            <div className="stones-grid">
                {filteredStones.map((stone) => (
                    <div key={stone.id} className="stone-card">
                        <div className="stone-header">
                            <h3>{stone.mineralType}</h3>
                            <span className="batch-number">{stone.batchNumber}</span>
                        </div>
                        <div className="stone-details">
                            <div className="detail-row">
                                <span>Location:</span>
                                <span>{stone.mineLocation}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mine Date:</span>
                                <span>{new Date(stone.mineDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{stone.weight} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Quality:</span>
                                <span>{stone.quality}</span>
                            </div>
                            <div className="detail-row">
                                <span>Miner:</span>
                                <span>{stone.minerName}</span>
                            </div>
                        </div>
                        <div className="stone-actions">
                            <button className="action-button">View Details</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableStones; 