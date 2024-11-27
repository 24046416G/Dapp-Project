import React, { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import QRCodeModal from './QRCodeModal.jsx';
import '../../css/modal.css';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    
    if (!isOpen) return null;
    if (showQRCode) {
        return <QRCodeModal 
            product={product} 
            isOpen={showQRCode} 
            onClose={() => setShowQRCode(false)} 
        />;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
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
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal; 