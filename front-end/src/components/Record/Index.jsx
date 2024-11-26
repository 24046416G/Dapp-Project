import React, { useState } from 'react';
import '../../css/layout.css';
import '../../css/search.css';
import '../../css/filter.css';
import '../../css/card.css';
import '../../css/record.css';
import AddRecordModal from './AddRecordModal.jsx';
import { USER_TYPES } from '../../constants/userTypes.js';
import RecordDetailModal from './RecordDetailModal.jsx';

const recordData = [
    {
        id: 1,
        mineralType: 'Diamond',
        location: 'Kimberley, South Africa',
        mineDate: '2024-03-15',
        weight: 2.5,
        quality: 'High',
        color: 'D',
        clarity: 'VVS1',
        status: 'Processed',
        batchNumber: 'KMB-2024-001',
        notes: 'Exceptional clarity and color',
        coordinates: 'S 28°44′46″ E 24°46′46″'
    },
    {
        id: 2,
        mineralType: 'Raw Diamond',
        location: 'Jwaneng, Botswana',
        mineDate: '2024-03-14',
        weight: 1.8,
        quality: 'Medium',
        color: 'F',
        clarity: 'VS2',
        status: 'In Processing',
        batchNumber: 'JWN-2024-045',
        notes: 'Minor inclusions present',
        coordinates: 'S 24°31′59″ E 24°43′36″'
    },
    // 可以添加更多记录...
];

const Record = ({ userType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [showAddModal, setShowAddModal] = useState(false);
    const [records, setRecords] = useState(recordData);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleAddRecord = (newRecord) => {
        setRecords(prevRecords => [newRecord, ...prevRecords]);
    };

    const handleRecordClick = (record) => {
        setSelectedRecord(record);
        setIsDetailModalOpen(true);
    };

    const filteredRecords = recordData
        .filter((record) => {
            const matchesSearch = 
                record.mineralType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (statusFilter === 'all') return matchesSearch;
            return matchesSearch && record.status === statusFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.mineDate) - new Date(a.mineDate);
                case 'weight':
                    return b.weight - a.weight;
                case 'quality':
                    return a.quality.localeCompare(b.quality);
                default:
                    return 0;
            }
        });

    return (
        <div className="record-container">
            <div className="record-header">
                <div className="header-content">
                    <div>
                        <h2>
                            {userType === USER_TYPES.MINER ? 'Mining Records' :
                             userType === USER_TYPES.GRADING ? 'Grading Records' :
                             userType === USER_TYPES.CUTTING ? 'Cutting Records' : 
                             'Undefined Records'}
                        </h2>
                        <p>Track and manage your {userType.toLowerCase()} operations</p>
                    </div>
                    <button 
                        className="add-record-button"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add New Record
                    </button>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by type, location, or batch number..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <div className="filter-controls">
                    <select 
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="Processed">Processed</option>
                        <option value="In Processing">In Processing</option>
                        <option value="Pending">Pending</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={handleSortChange}
                        className="filter-select"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="weight">Sort by Weight</option>
                        <option value="quality">Sort by Quality</option>
                    </select>
                </div>
            </div>

            <div className="collection-grid">
                {filteredRecords.map((record) => (
                    <div 
                        key={record.id} 
                        className="collection-card record-card"
                        onClick={() => handleRecordClick(record)}
                    >
                        <div className="record-main-info">
                            <div>
                                <h3>{record.mineralType}</h3>
                                <p className="batch-number">{record.batchNumber}</p>
                            </div>
                            <span className={`status-badge ${record.status.toLowerCase().replace(' ', '-')}`}>
                                {record.status}
                            </span>
                        </div>

                        <div className="record-details">
                            <div className="detail-row">
                                <span>Mining Company:</span>
                                <span>{record.miningCompany}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Date:</span>
                                <span>{new Date(record.miningDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Position:</span>
                                <span>{record.miningPosition}</span>
                            </div>
                            <div className="detail-row">
                                <span>Category:</span>
                                <span>{record.category}</span>
                            </div>
                            <div className="detail-row">
                                <span>Cutting Date:</span>
                                <span>{new Date(record.cuttingDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Polishing Tech:</span>
                                <span>{record.polishingTech}</span>
                            </div>
                            <div className="detail-row">
                                <span>Cutting Tech:</span>
                                <span>{record.cuttingTech}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{record.weight} carats</span>
                            </div>
                        </div>

                        {record.notes && (
                            <div className="record-notes">
                                <p>{record.notes}</p>
                            </div>
                        )}

                        <div className="record-actions">
                            <button 
                                className="action-button view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecordClick(record);
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRecord && (
                <RecordDetailModal
                    record={selectedRecord}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}

            <AddRecordModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddRecord}
                userType={userType}
            />
        </div>
    );
};

export default Record; 