import React, { useState } from 'react';
import '../../css/availableStones.css';
import CuttingModal from './CuttingModal.jsx';

// 模拟可用原石数据
const availableStonesData = [
    {
        id: 1,
        batchNumber: 'RAW-2024-001',
        mineralType: 'Diamond',
        weight: 3.5,
        quality: 'High',
        miningCompany: 'DeBeers Mining Corp',
        miningTime: '2024-02-15',
        miningPosition: 'S 25°52′48″ E 25°38′24″ (Jwaneng Mine)',
        price: 15000,
        status: 'Available',
        cuttingStatus: 'Confirmed'
    },
    {
        id: 2,
        batchNumber: 'RAW-2024-002',
        mineralType: 'Diamond',
        weight: 2.8,
        quality: 'Medium',
        miningCompany: 'ALROSA',
        miningTime: '2024-02-20',
        miningPosition: 'N 65°16′12″ E 112°19′48″ (Mir Mine)',
        price: 12000,
        status: 'Available',
        cuttingStatus: 'Pending'
    }
];

const AvailableStones = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStone, setSelectedStone] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCuttingClick = (stone) => {
        setSelectedStone(stone);
        setIsModalOpen(true);
    };

    const handleCuttingSubmit = (formData) => {
        // 这里处理切割表单提交
        console.log('Cutting process started for stone:', selectedStone);
        console.log('Form data:', formData);
        // 可以添加API调用等逻辑
    };

    const filteredStones = availableStonesData.filter((stone) =>
        stone.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stone.miningPosition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="available-stones-container">
            <div className="stones-header">
                <div className="header-content">
                    <div>
                        <h2>Available Raw Materials</h2>
                        <p>Select raw diamonds for cutting process</p>
                    </div>
                </div>
            </div>
            
            <div className="stones-filters">
                <input
                    type="text"
                    placeholder="Search by batch number or location..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
            </div>

            <div className="stones-grid">
                {filteredStones.map((stone) => (
                    <div key={stone.id} className="stone-card">
                        <div className="stone-status">
                            <span className={`status-badge ${stone.cuttingStatus.toLowerCase().replace(/ /g, '-')}`}>
                                {stone.cuttingStatus}
                            </span>
                        </div>
                        <div className="stone-header">
                            <h3>{stone.mineralType}</h3>
                            <span className="batch-number">{stone.batchNumber}</span>
                        </div>
                        <div className="stone-details">
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{stone.weight} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Quality:</span>
                                <span>{stone.quality}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Company:</span>
                                <span>{stone.miningCompany}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Time:</span>
                                <span>{new Date(stone.miningTime).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Position:</span>
                                <span>{stone.miningPosition}</span>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <span>${stone.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="stone-actions">
                            <button 
                                className="action-button"
                                onClick={() => handleCuttingClick(stone)}
                            >
                                Cut This Raw Material
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedStone && (
                <CuttingModal
                    stone={selectedStone}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCuttingSubmit}
                />
            )}
        </div>
    );
};

export default AvailableStones; 