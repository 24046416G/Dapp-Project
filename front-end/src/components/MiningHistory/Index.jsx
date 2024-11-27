import React, { useState, useEffect } from 'react';
import '../../css/miningHistory.css';
import MiningHistoryDetailModal from './MiningHistoryDetailModal.jsx';

const MiningHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [diamonds, setDiamonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiamonds = async () => {
            try {
                // 获取当前登录用户信息
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    throw new Error('User not found');
                }
                const user = JSON.parse(userStr);
                console.log('Current user:', user);

                console.log('Attempting to fetch diamonds...');
                const response = await fetch('http://localhost:3000/diamonds/all/diamonds', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).catch(error => {
                    console.error('Fetch error:', error);
                    throw new Error(`Network error: ${error.message}`);
                });

                console.log('Response received:', response);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Response not ok:', errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Data received:', data);

                // 过滤出MINED状态且属于当前用户的钻石
                const minedDiamonds = data.filter(diamond => {
                    const isMatch = diamond.status === 'MINED' && 
                                  diamond.currentOwner._id === user.id;
                    console.log(`Diamond ${diamond.diamondId}: status=${diamond.status}, owner=${diamond.currentOwner._id}, isMatch=${isMatch}`);
                    return isMatch;
                });

                console.log('Filtered diamonds:', minedDiamonds);
                setDiamonds(minedDiamonds);
                setLoading(false);
            } catch (error) {
                console.error('Error in fetchDiamonds:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDiamonds();
    }, []);

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

    const filteredDiamonds = diamonds
        .filter((diamond) => {
            return diamond.diamondId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   (diamond.metadata.origin && diamond.metadata.origin.toLowerCase().includes(searchTerm.toLowerCase()));
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'weight':
                    return (b.metadata.carat || 0) - (a.metadata.carat || 0);
                case 'price':
                    return (b.price || 0) - (a.price || 0);
                default:
                    return 0;
            }
        });

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="record-container">
            <div className="record-header">
                <div className="header-content">
                    <div>
                        <h2>Mining History</h2>
                        <p>Track your mined diamonds</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Mined</span>
                            <span className="stat-value">{diamonds.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by diamond ID or origin..."
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
                        <option value="date">Sort by Mining Date</option>
                        <option value="weight">Sort by Weight</option>
                        <option value="price">Sort by Price</option>
                    </select>
                </div>
            </div>

            <div className="collection-grid">
                {filteredDiamonds.map((diamond) => (
                    <div 
                        key={diamond._id} 
                        className="collection-card"
                        onClick={() => handleHistoryClick(diamond)}
                    >
                        <div className="record-main-info">
                            <div>
                                <h3>{diamond.diamondType || 'Diamond'}</h3>
                                <p className="batch-number">{diamond.diamondId}</p>
                            </div>
                            <span className="status-badge transferred">
                                {diamond.status}
                            </span>
                        </div>

                        <div className="record-details">
                            <div className="detail-row">
                                <span>Mining Certificate:</span>
                                <span>{diamond.certificates?.miningCertificate?.status || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Origin:</span>
                                <span>{diamond.metadata?.origin || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{diamond.metadata?.carat || 'N/A'} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Color:</span>
                                <span>{diamond.metadata?.color || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <span>${diamond.price?.toLocaleString() || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="record-actions">
                            <button 
                                className="action-button view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHistoryClick(diamond);
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