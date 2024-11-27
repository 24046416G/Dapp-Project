import React, { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import QRCodeModal from '../QRCodeModal/Index.jsx';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/modal.css';

const ProductDetailModal = ({ product, isOpen, onClose, userType }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    
    if (!isOpen) return null;

    const renderContent = () => {
        if (userType === USER_TYPES.JEWELER) {
            const diamond = product.diamonds[0];
            return (
                <>
                    <div className="modal-image">
                        {diamond.metadata.images ? (
                            <img 
                                src={diamond.metadata.images}
                                alt={diamond.diamondId}
                            />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                    </div>
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Diamond Details</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Diamond ID:</span>
                                    <span>{diamond.diamondId}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Price:</span>
                                    <span>${product.price}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Current Owner:</span>
                                    <span>{product.currentOwner?.name || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Diamond Specifications</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Carat:</span>
                                    <span>{diamond.metadata.carat}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Color:</span>
                                    <span>{diamond.metadata.color}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Cut:</span>
                                    <span>{diamond.metadata.cut}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Polish:</span>
                                    <span>{diamond.metadata.polish}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Grading:</span>
                                    <span>{diamond.metadata.grading}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Origin:</span>
                                    <span>{diamond.metadata.origin}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Certificates</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Mining:</span>
                                    <span>{diamond.certificates.miningCertificate.status}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Cutting:</span>
                                    <span>{diamond.certificates.cuttingCertificate.status}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Grading:</span>
                                    <span>{diamond.certificates.gradingCertificate.status}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="modal-image">
                        {product.image ? (
                            <img 
                                src={product.image}
                                alt={product.name}
                            />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                    </div>
                    <div className="modal-info">
                        <div className="info-section">
                            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Product Details
                                <FaQrcode 
                                    style={{ fontSize: '1.2em', cursor: 'pointer' }} 
                                    onClick={() => setShowQRCode(true)}
                                />
                            </h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Name:</span>
                                    <span>{product.name}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Price:</span>
                                    <span>${product.price}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Description:</span>
                                    <span>{product.description}</span>
                                </div>
                            </div>
                        </div>

                        {product.diamonds && product.diamonds.map((diamond, index) => (
                            <div key={index} className="info-section">
                                <h3>Diamond {diamond.diamondId} Details</h3>
                                {diamond.metadata.images && (
                                    <div className="modal-image">
                                    {diamond.metadata.images ? (
                                        <img 
                                            src={diamond.metadata.images}
                                            alt={diamond.diamondId}
                                        />
                                    ) : (
                                        <div className="no-image">No Image Available</div>
                                    )}
                                </div>
                                )}
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span>Carat:</span>
                                        <span>{diamond.metadata.carat}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Color:</span>
                                        <span>{diamond.metadata.color}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Cut:</span>
                                        <span>{diamond.metadata.cut}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Polish:</span>
                                        <span>{diamond.metadata.polish}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Grading:</span>
                                        <span>{diamond.metadata.grading}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Origin:</span>
                                        <span>{diamond.metadata.origin}</span>
                                    </div>
                                </div>

                                <h3>Certificates</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span>Mining:</span>
                                        <span>{diamond.certificates.miningCertificate.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Cutting:</span>
                                        <span>{diamond.certificates.cuttingCertificate.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Grading:</span>
                                        <span>{diamond.certificates.gradingCertificate.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Jewelry:</span>
                                        <span>{diamond.certificates.jewelryCertificate.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{product.name}</h2>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        {renderContent()}
                    </div>
                </div>
            </div>
            {showQRCode && (
                <QRCodeModal 
                    product={product} 
                    isOpen={showQRCode} 
                    onClose={() => setShowQRCode(false)} 
                />
            )}
        </>
    );
};

export default ProductDetailModal; 