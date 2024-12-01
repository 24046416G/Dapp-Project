import React, { useState } from 'react';
import Button from '../Common/Button/Index.jsx';
import '../../css/certificate.css';

const Certificate = () => {
    const [certificateHash, setCertificateHash] = useState('');
    const [jewelryInfo, setJewelryInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verificationResult, setVerificationResult] = useState(null);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const handleInputChange = (e) => {
        setCertificateHash(e.target.value);
        setJewelryInfo(null);
        setError(null);
        setVerificationResult(null);
    };

    const handleQuery = async () => {
        if (!certificateHash.trim()) {
            setError('Please enter a certificate hash');
            return;
        }

        setLoading(true);
        setError(null);
        setJewelryInfo(null);
        setVerificationResult(null);

        try {
            // 1. 首先查询珠宝信息
            const jewelryResponse = await fetch(`http://localhost:3000/jewelries/query/${certificateHash}`);
            const jewelryData = await jewelryResponse.json();

            if (!jewelryResponse.ok) {
                throw new Error(jewelryData.message || 'Failed to query jewelry information');
            }

            setJewelryInfo(jewelryData.jewelry);

            // 2. 然后验证区块链上的交易
            const blockchainResponse = await fetch(`http://localhost:3001/api/diamond/tx/${certificateHash}`);
            const blockchainData = await blockchainResponse.json();

            if (blockchainResponse.ok && blockchainData.success) {
                setVerificationResult({
                    success: true,
                    message: "Your jewelry certification was verified"
                });
            } else {
                setVerificationResult({
                    success: false,
                    message: "Invalid certification"
                });
            }
            
            setShowVerificationModal(true);

        } catch (error) {
            console.error('Query error:', error);
            setError(error.message);
            setVerificationResult({
                success: false,
                message: "Invalid certification"
            });
            setShowVerificationModal(true);
        } finally {
            setLoading(false);
        }
    };

    const VerificationModal = () => {
        if (!showVerificationModal) return null;

        return (
            <div className="modal-overlay">
                <div className="verification-modal">
                    <div className={`verification-result ${verificationResult?.success ? 'success' : 'error'}`}>
                        <h3>{verificationResult?.message}</h3>
                    </div>
                    <Button 
                        onClick={() => setShowVerificationModal(false)}
                        className="verification-close-button"
                    >
                        Close
                    </Button>
                </div>
            </div>
        );
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

            <VerificationModal />
        </div>
    );
};

export default Certificate; 