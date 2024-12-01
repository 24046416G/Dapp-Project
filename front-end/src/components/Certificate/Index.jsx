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

            // 如果找不到珠宝，尝试查找单个证书
            if (!jewelryResponse.ok) {
                // 查询所有钻石
                const diamondsResponse = await fetch('http://localhost:3000/diamonds/all/diamonds');
                const diamondsData = await diamondsResponse.json();
                
                // 在所有证书中查找匹配的证书哈希
                const diamond = diamondsData.find(d => 
                    d.certificates?.miningCertificate?.certificateHash === certificateHash ||
                    d.certificates?.cuttingCertificate?.certificateHash === certificateHash ||
                    d.certificates?.gradingCertificate?.certificateHash === certificateHash
                );

                if (diamond) {
                    // 确定是哪种证书
                    let certificateType = null;
                    let certificate = null;

                    if (diamond.certificates?.miningCertificate?.certificateHash === certificateHash) {
                        certificateType = 'Mining';
                        certificate = diamond.certificates.miningCertificate;
                    } else if (diamond.certificates?.cuttingCertificate?.certificateHash === certificateHash) {
                        certificateType = 'Cutting';
                        certificate = diamond.certificates.cuttingCertificate;
                    } else if (diamond.certificates?.gradingCertificate?.certificateHash === certificateHash) {
                        certificateType = 'Grading';
                        certificate = diamond.certificates.gradingCertificate;
                    }

                    setJewelryInfo({
                        type: 'certificate',
                        certificateType,
                        diamond,
                        certificate
                    });
                } else {
                    throw new Error('No certificate found with this hash');
                }
            } else {
                setJewelryInfo({
                    type: 'jewelry',
                    ...jewelryData.jewelry
                });
            }

            // 2. 验证区块链上的交易
            const blockchainResponse = await fetch(`http://localhost:3001/api/diamond/tx/${certificateHash}`);
            const blockchainData = await blockchainResponse.json();

            if (blockchainResponse.ok && blockchainData.success) {
                setVerificationResult({
                    success: true,
                    message: "Certificate was verified"
                });
            } else {
                setVerificationResult({
                    success: false,
                    message: "Invalid certificate"
                });
            }
            
            setShowVerificationModal(true);

        } catch (error) {
            console.error('Query error:', error);
            setError(error.message);
            setVerificationResult({
                success: false,
                message: "Invalid certificate"
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
                        {jewelryInfo.type === 'jewelry' ? (
                            // 显示珠宝信息的现有代码...
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

                                {/* 添加钻石证书信息 */}
                                {jewelryInfo.diamonds?.map((diamond, index) => (
                                    <div key={diamond._id} className="diamond-certificates">
                                        <h4>Diamond {index + 1} Certificates</h4>
                                        
                                        {/* 采矿证书 */}
                                        {diamond.certificates?.miningCertificate && (
                                            <div className="certificate-section">
                                                <h5>Mining Certificate</h5>
                                                <div className="certificate-info">
                                                    <div className="info-item">
                                                        <span>Company:</span>
                                                        <span>{diamond.certificates.miningCertificate.companyId?.companyName || 'N/A'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span>Certificate Hash:</span>
                                                        <span>{diamond.certificates.miningCertificate.certificateHash || 'N/A'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span>Date:</span>
                                                        <span>{new Date(diamond.certificates.miningCertificate.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 切割证书 */}
                                        {diamond.certificates?.cuttingCertificate && (
                                            <div className="certificate-section">
                                                <h5>Cutting Certificate</h5>
                                                <div className="certificate-info">
                                                    <div className="info-item">
                                                        <span>Company:</span>
                                                        <span>{diamond.certificates.cuttingCertificate.companyId?.companyName || 'N/A'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span>Certificate Hash:</span>
                                                        <span>{diamond.certificates.cuttingCertificate.certificateHash || 'N/A'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span>Date:</span>
                                                        <span>{new Date(diamond.certificates.cuttingCertificate.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 评级证书 */}
                                        {diamond.certificates?.gradingCertificate && (
                                            <div className="certificate-section">
                                                <h5>Grading Certificate</h5>
                                                <div className="certificate-info">
                                                    <div className="info-item">
                                                        <span>Company:</span>
                                                        <span>{diamond.certificates.gradingCertificate.companyId?.companyName || 'N/A'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span>Certificate Hash:</span>
                                                        <span>{diamond.certificates.gradingCertificate.certificateHash || 'N/A'}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span>Date:</span>
                                                        <span>{new Date(diamond.certificates.gradingCertificate.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // 显示单个证书信息
                            <div>
                                <h3>{jewelryInfo.certificateType} Certificate Information</h3>
                                <div className="certificate-section">
                                    <div className="certificate-info">
                                        <div className="info-item">
                                            <span>Diamond ID:</span>
                                            <span>{jewelryInfo.diamond.diamondId}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Company:</span>
                                            <span>{jewelryInfo.certificate.companyId?.companyName || 'N/A'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Certificate Hash:</span>
                                            <span>{jewelryInfo.certificate.certificateHash}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Issue Date:</span>
                                            <span>{new Date(jewelryInfo.certificate.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        {jewelryInfo.certificateType === 'Mining' && (
                                            <>
                                                <div className="info-item">
                                                    <span>Origin:</span>
                                                    <span>{jewelryInfo.diamond.metadata?.origin || 'N/A'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span>Carat:</span>
                                                    <span>{jewelryInfo.diamond.metadata?.carat || 'N/A'}</span>
                                                </div>
                                            </>
                                        )}
                                        {jewelryInfo.certificateType === 'Cutting' && (
                                            <>
                                                <div className="info-item">
                                                    <span>Cut Type:</span>
                                                    <span>{jewelryInfo.diamond.metadata?.cut || 'N/A'}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span>Polish:</span>
                                                    <span>{jewelryInfo.diamond.metadata?.polish || 'N/A'}</span>
                                                </div>
                                            </>
                                        )}
                                        {jewelryInfo.certificateType === 'Grading' && (
                                            <>
                                                <div className="info-item">
                                                    <span>Grade:</span>
                                                    <span>{jewelryInfo.diamond.metadata?.grading || 'N/A'}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <VerificationModal />
        </div>
    );
};

export default Certificate; 