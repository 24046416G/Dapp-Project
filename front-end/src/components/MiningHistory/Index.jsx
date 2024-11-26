import React, { useState } from 'react';
import '../../css/layout.css';
import '../../css/search.css';
import '../../css/filter.css';
import '../../css/card.css';
import '../../css/miningHistory.css';
import MiningHistoryDetailModal from './MiningHistoryDetailModal.jsx';

const historyData = [
    {
        id: 1,
        mineralType: 'Diamond',
        miningCompany: 'DeBeers Mining Corp',
        miningDate: '2024-02-15',
        miningPosition: 'S 28°44′46″ E 24°46′46″',
        weight: 2.5,
        transferDate: '2024-02-20',
        transferredTo: 'ABC Cutting Corp',
        batchNumber: 'KMB-2024-001',
        status: 'Transferred',
        category: 'Raw Diamond',
        price: 15000
    },
    {
        id: 2,
        mineralType: 'Diamond',
        miningCompany: 'DeBeers Mining Corp',
        miningDate: '2024-02-10',
        miningPosition: 'S 25°43′60″ E 27°07′48″',
        weight: 3.2,
        transferDate: '2024-02-17',
        transferredTo: 'XYZ Cutting Corp',
        batchNumber: 'KMB-2024-002',
        status: 'Transferred',
        category: 'Raw Diamond',
        price: 18000
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
                case 'price':
                    return b.price - a.price;
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
                        <option value="price">Sort by Price</option>
                    </select>
                </div>
            </div>

            <div className="collection-grid">
                {filteredHistory.map((history) => (
                    <div 
                        key={history.id} 
                        className="collection-card"
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
                                <span>Mining Date:</span>
                                <span>{new Date(history.miningDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Transfer Date:</span>
                                <span>{new Date(history.transferDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Transferred To:</span>
                                <span>{history.transferredTo}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Position:</span>
                                <span>{history.miningPosition}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{history.weight} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <span>${history.price.toLocaleString()}</span>
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