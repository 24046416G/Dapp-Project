import React, { useState } from 'react';
import '../../css/miningHistory.css';
import MiningHistoryDetailModal from './MiningHistoryDetailModal.jsx';

const historyData = [
    {
        id: 1,
        mineralType: 'Diamond',
        batchNumber: 'KMB-2024-001',
        transferDate: '2024-03-20',
        transferredTo: 'ABC Cutting Corp',
        location: 'Kimberley, South Africa',
        mineDate: '2024-03-15',
        weight: 2.5,
        quality: 'High',
        color: 'D',
        clarity: 'VVS1',
        status: 'Transferred',
        miningPosition: 'S 28°44′46″ E 24°46′46″'
    },
    {
        id: 2,
        mineralType: 'Diamond',
        batchNumber: 'JWN-2024-045',
        transferDate: '2024-03-19',
        transferredTo: 'XYZ Cutting Corp',
        location: 'Jwaneng, Botswana',
        mineDate: '2024-03-14',
        weight: 1.8,
        quality: 'Medium',
        color: 'F',
        clarity: 'VS2',
        status: 'Transferred',
        miningPosition: 'N 65°16′12″ E 112°19′48″'
    }
];

const MiningHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleHistoryClick = (history) => {
        setSelectedHistory(history);
        setIsDetailModalOpen(true);
    };

    const filteredHistory = historyData
        .filter((history) => {
            return history.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   history.transferredTo.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.transferDate) - new Date(a.transferDate);
                case 'weight':
                    return b.weight - a.weight;
                default:
                    return 0;
            }
        });

    return (
        <div className="record-container">
            <div className="record-header">
                <div className="header-content">
                    <div>
                        <h2>Mining History</h2>
                        <p>Track your transferred diamonds</p>
                    </div>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by batch number or cutting company..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <div className="filter-controls">
                    <select 
                        value={sortBy}
                        onChange={handleSortChange}
                        className="filter-select"
                    >
                        <option value="date">Sort by Transfer Date</option>
                        <option value="weight">Sort by Weight</option>
                    </select>
                </div>
            </div>

            <div className="collection-grid">
                {filteredHistory.map((history) => (
                    <div 
                        key={history.id} 
                        className="collection-card record-card"
                        onClick={() => handleHistoryClick(history)}
                    >
                        <div className="record-main-info">
                            <div>
                                <h3>{history.mineralType}</h3>
                                <p className="batch-number">{history.batchNumber}</p>
                            </div>
                            <span className="status-badge transferred">
                                {history.status}
                            </span>
                        </div>

                        <div className="record-details">
                            <div className="detail-row">
                                <span>Transfer Date:</span>
                                <span>{new Date(history.transferDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Transferred To:</span>
                                <span>{history.transferredTo}</span>
                            </div>
                            <div className="detail-row">
                                <span>Location:</span>
                                <span>{history.location}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Date:</span>
                                <span>{new Date(history.mineDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{history.weight} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Quality:</span>
                                <span>{history.quality}</span>
                            </div>
                        </div>

                        <div className="record-actions">
                            <button 
                                className="action-button view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHistoryClick(history);
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedHistory && (
                <MiningHistoryDetailModal
                    history={selectedHistory}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MiningHistory; 