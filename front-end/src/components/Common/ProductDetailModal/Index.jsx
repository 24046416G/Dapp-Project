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
                            <div className="certificate-info">
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
            // 原有的珠宝展示逻辑保持不变
            return (
                <>
                    <div className="modal-image">
                        {product.image ? (
                            <img 
                                src={`data:image/jpeg;base64,${product.image}`} 
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
                                    <span>Price:</span>
                                    <span>${product.price}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Description:</span>
                                    <span>{product.description}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Diamonds Information</h3>
                            {product.diamonds && product.diamonds.map((diamond, index) => (
                                <div key={index} className="diamond-info">
                                    <h4>Diamond {diamond.diamondId}</h4>
                                    {diamond.metadata.images && (
                                        <div className="diamond-images">
                                            <div className="diamond-image">
                                                <img 
                                                    src={diamond.metadata.images}
                                                    alt={`Diamond ${index + 1}`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="collection-specs">
                                        <span>Carat: {diamond.metadata.carat}</span>
                                        <span>Color: {diamond.metadata.color}</span>
                                        <span>Cut: {diamond.metadata.cut}</span>
                                        <span>Polish: {diamond.metadata.polish}</span>
                                        <span>Grading: {diamond.metadata.grading}</span>
                                        <span>Origin: {diamond.metadata.origin}</span>
                                    </div>
                                    <div className="certificate-info">
                                        <p>Certificates:</p>
                                        <ul>
                                            <li>Mining: {diamond.certificates.miningCertificate.status}</li>
                                            <li>Cutting: {diamond.certificates.cuttingCertificate.status}</li>
                                            <li>Grading: {diamond.certificates.gradingCertificate.status}</li>
                                            <li>Jewelry: {diamond.certificates.jewelryCertificate.status}</li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
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