import React, { useState } from 'react';
import '../../css/waitToGrade.css';
import WaitToGradeDetailModal from './WaitToGradeDetailModal.jsx';

const waitingDiamondsData = [
    {
        id: 1,
        mineralType: 'Cut Diamond',
        batchNumber: 'CUT-2024-001',
        fromCompany: 'ABC Cutting Corp',
        receivedDate: '2024-03-15',
        cuttingDate: '2024-03-10',
        weight: 2.5,
        polishingTech: 'Traditional',
        cuttingTech: 'Laser',
        status: 'Pending',
        miningInfo: {
            company: 'DeBeers Mining Corp',
            date: '2024-02-15',
            position: 'S 28°44′46″ E 24°46′46″'
        }
    },
    {
        id: 2,
        mineralType: 'Cut Diamond',
        batchNumber: 'CUT-2024-002',
        fromCompany: 'XYZ Cutting Corp',
        receivedDate: '2024-03-16',
        cuttingDate: '2024-03-12',
        weight: 1.8,
        polishingTech: 'Modern',
        cuttingTech: 'Mechanical',
        status: 'Pending',
        miningInfo: {
            company: 'ALROSA',
            date: '2024-02-20',
            position: 'N 65°16′12″ E 112°19′48″'
        }
    }
];

const WaitToGrade = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [selectedDiamond, setSelectedDiamond] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleDiamondClick = (diamond) => {
        setSelectedDiamond(diamond);
        setIsDetailModalOpen(true);
    };

    const startGrading = (diamond) => {
        // 这里添加开始评级的逻辑
        console.log(`Starting grading process for diamond ${diamond.batchNumber}`);
        alert(`Started grading process for ${diamond.batchNumber}`);
    };

    const filteredDiamonds = waitingDiamondsData
        .filter((diamond) => {
            return diamond.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   diamond.fromCompany.toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.receivedDate) - new Date(a.receivedDate);
                case 'weight':
                    return b.weight - a.weight;
                default:
                    return 0;
            }
        });

    return (
        <div className="wait-to-grade-container">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h2>Diamonds Waiting for Grading</h2>
                        <p>Manage incoming diamonds from cutting companies</p>
                    </div>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by batch number or company..."
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
                        <option value="date">Sort by Received Date</option>
                        <option value="weight">Sort by Weight</option>
                    </select>
                </div>
            </div>

            <div className="diamonds-grid">
                {filteredDiamonds.map((diamond) => (
                    <div 
                        key={diamond.id} 
                        className="diamond-card"
                        onClick={() => handleDiamondClick(diamond)}
                    >
                        <div className="diamond-main-info">
                            <div>
                                <h3>{diamond.mineralType}</h3>
                                <p className="batch-number">{diamond.batchNumber}</p>
                            </div>
                            <span className="status-badge pending">
                                {diamond.status}
                            </span>
                        </div>

                        <div className="diamond-details">
                            <div className="detail-row">
                                <span>From Company:</span>
                                <span>{diamond.fromCompany}</span>
                            </div>
                            <div className="detail-row">
                                <span>Received Date:</span>
                                <span>{new Date(diamond.receivedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{diamond.weight} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Cutting Tech:</span>
                                <span>{diamond.cuttingTech}</span>
                            </div>
                            <div className="detail-row">
                                <span>Polishing Tech:</span>
                                <span>{diamond.polishingTech}</span>
                            </div>
                        </div>

                        <div className="diamond-actions">
                            <button 
                                className="action-button view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDiamondClick(diamond);
                                }}
                            >
                                View Details
                            </button>
                            <button 
                                className="action-button start-grading"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startGrading(diamond);
                                }}
                            >
                                Start Grading
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedDiamond && (
                <WaitToGradeDetailModal
                    diamond={selectedDiamond}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default WaitToGrade; 