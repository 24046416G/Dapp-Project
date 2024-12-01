import React, { useState } from 'react';
import Button from '../Common/Button/Index.jsx';
import '../../css/certificate.css';

const Certificate = () => {
    const [certificateHash, setCertificateHash] = useState('');
    const [jewelryInfo, setJewelryInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setCertificateHash(e.target.value);
        // 清除之前的查询结果
        setJewelryInfo(null);
        setError(null);
    };

    const handleQuery = async () => {
        if (!certificateHash.trim()) {
            setError('Please enter a certificate hash');
            return;
        }

        setLoading(true);
        setError(null);
        setJewelryInfo(null);

        try {
            const response = await fetch(`http://localhost:3000/jewelries/query/${certificateHash}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to query jewelry information');
            }

            if (data.jewelry) {
                setJewelryInfo(data.jewelry);
            } else {
                setError('No jewelry found with this certificate hash');
            }
        } catch (error) {
            console.error('Query error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="certificate-container">
            <div className="certificate-header">
                <h2>Jewelry Query</h2>
                <p>Enter certificate hash to query jewelry information</p>
            </div>
            
            <div className="certificate-content">
                <div className="input-section">
                    <label>Certificate Hash</label>
                    <input
                        type="text"
                        value={certificateHash}
                        onChange={handleInputChange}
                        placeholder="Enter certificate hash..."
                        className="certificate-input"
                    />
                    <Button 
                        onClick={handleQuery}
                        className="query-button"
                        disabled={loading}
                    >
                        {loading ? 'Querying...' : 'Query'}
                    </Button>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {jewelryInfo && (
                    <div className="result-section">
                        <h3>Jewelry Information</h3>
                        <div className="jewelry-info">
                            <div className="info-item">
                                <span>Jewelry ID:</span>
                                <span>{jewelryInfo.jewelryId}</span>
                            </div>
                            <div className="info-item">
                                <span>Name:</span>
                                <span>{jewelryInfo.name}</span>
                            </div>
                            <div className="info-item">
                                <span>Price:</span>
                                <span>${jewelryInfo.price?.toLocaleString()}</span>
                            </div>
                            <div className="info-item">
                                <span>Diamonds Used:</span>
                                <span>{jewelryInfo.diamonds?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Certificate; 