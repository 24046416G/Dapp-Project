import React, { useState, useEffect } from 'react';
import '../../css/availableStones.css';
import CuttingModal from './CuttingModal.jsx';

const AvailableStones = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStone, setSelectedStone] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [availableStones, setAvailableStones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStones = async () => {
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

                // 过滤出需要切割的钻石（状态为CUT且没有切割和抛光信息）
                const stonesToCut = data.filter(diamond => 
                    diamond.status === 'CUT' && 
                    (!diamond.metadata.cut || !diamond.metadata.polish)
                );

                console.log('Filtered stones:', stonesToCut);
                setAvailableStones(stonesToCut);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stones:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchStones();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCuttingClick = (stone) => {
        setSelectedStone(stone);
        setIsModalOpen(true);
    };

    const handleCuttingSubmit = async (formData) => {
        console.log('formData', formData);
        try {
            // 获取当前用户信息
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userStr);

            // 更新钻石的切割信息
            const response = await fetch(`http://localhost:3000/diamonds/${selectedStone._id}/cut`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    cut: formData.cuttingTechnology,
                    polish: formData.polishingTechnology
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update diamond cutting information');
            }

            // 刷新钻石列表
            const updatedResponse = await fetch('http://localhost:3000/diamonds/all/diamonds');
            const updatedData = await updatedResponse.json();
            const updatedStonesToCut = updatedData.filter(diamond => 
                diamond.status === 'CUT' && 
                (!diamond.metadata.cut || !diamond.metadata.polish)
            );
            setAvailableStones(updatedStonesToCut);

            alert('Cutting process started successfully!');
        } catch (error) {
            console.error('Error updating cutting information:', error);
            alert('Failed to start cutting process: ' + error.message);
        }
    };

    const filteredStones = availableStones.filter((stone) =>
        stone.diamondId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stone.metadata.origin && stone.metadata.origin.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

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
                    <div key={stone._id} className="stone-card">
                        <div className="stone-status">
                            <span className={`status-badge ${stone.certificates?.cuttingCertificate?.status?.toLowerCase() || 'pending'}`}>
                                {stone.certificates?.cuttingCertificate?.status || 'Pending'}
                            </span>
                        </div>
                        <div className="stone-header">
                            <h3>{stone.diamondType || 'Diamond'}</h3>
                            <span className="batch-number">{stone.diamondId}</span>
                        </div>
                        <div className="stone-details">
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{stone.metadata?.carat || 'N/A'} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Quality:</span>
                                <span>{stone.metadata?.quality || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Company:</span>
                                <span>{stone.certificates?.miningCertificate?.companyId?.companyName || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Time:</span>
                                <span>{stone.certificates?.miningCertificate?.timestamp ? 
                                    new Date(stone.certificates.miningCertificate.timestamp).toLocaleDateString() : 
                                    'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Origin:</span>
                                <span>{stone.metadata?.origin || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <span>${stone.price?.toLocaleString() || 'N/A'}</span>
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