import React, { useState, useEffect } from 'react';
import '../../css/waitToGrade.css';
import WaitToGradeDetailModal from './WaitToGradeDetailModal.jsx';

const WaitToGrade = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [waitingDiamonds, setWaitingDiamonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [selectedDiamondForGrading, setSelectedDiamondForGrading] = useState(null);

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

                // 获取所有钻石
                const response = await fetch('http://localhost:3000/diamonds/all/diamonds', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch diamonds');
                }

                const data = await response.json();
                console.log('Fetched diamonds:', data);

                // 过滤出需要评级的钻石（状态为GRADED且没有评级和图片信息）
                const diamondsToGrade = data.filter(diamond => 
                    diamond.status === 'GRADED' && 
                    (!diamond.metadata.grading || !diamond.metadata.images)
                );

                console.log('Filtered diamonds:', diamondsToGrade);
                setWaitingDiamonds(diamondsToGrade);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching diamonds:', error);
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

    const startGrading = (diamond) => {
        setSelectedDiamondForGrading(diamond);
        setIsGradingModalOpen(true);
    };

    const handleGradingSubmit = async (gradingData) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userStr);

            const response = await fetch(`http://localhost:3000/diamonds/${selectedDiamondForGrading._id}/grade`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    grading: gradingData.grading,
                    imageData: gradingData.imageData
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit grading');
            }

            // 刷新钻石列表
            const updatedResponse = await fetch('http://localhost:3000/diamonds/all/diamonds');
            const updatedData = await updatedResponse.json();
            const updatedDiamondsToGrade = updatedData.filter(d => 
                d.status === 'GRADED' && 
                (!d.metadata.grading || !d.metadata.images)
            );
            setWaitingDiamonds(updatedDiamondsToGrade);

            setIsGradingModalOpen(false);
            setSelectedDiamondForGrading(null);
            alert('Grading submitted successfully');
        } catch (error) {
            console.error('Error submitting grading:', error);
            alert('Failed to submit grading: ' + error.message);
        }
    };

    const filteredDiamonds = waitingDiamonds
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
                        key={diamond._id} 
                        className="diamond-card"
                    >
                        <div className="diamond-main-info">
                            <div>
                                <h3>{diamond.diamondType || 'Diamond'}</h3>
                                <p className="batch-number">{diamond.diamondId}</p>
                            </div>
                        </div>

                        <div className="diamond-details">
                            <div className="detail-row">
                                <span>From Company:</span>
                                <span>{diamond.certificates?.cuttingCertificate?.companyId?.companyName || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Cutting Date:</span>
                                <span>{diamond.certificates?.cuttingCertificate?.timestamp ? 
                                    new Date(diamond.certificates.cuttingCertificate.timestamp).toLocaleDateString() : 
                                    'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{diamond.metadata?.carat || 'N/A'} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Cut:</span>
                                <span>{diamond.metadata?.cut || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Polish:</span>
                                <span>{diamond.metadata?.polish || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="diamond-actions">
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

            {isGradingModalOpen && selectedDiamondForGrading && (
                <WaitToGradeDetailModal
                    diamond={selectedDiamondForGrading}
                    isOpen={isGradingModalOpen}
                    onClose={() => {
                        setIsGradingModalOpen(false);
                        setSelectedDiamondForGrading(null);
                    }}
                    onSubmit={handleGradingSubmit}
                />
            )}
        </div>
    );
};

export default WaitToGrade; 