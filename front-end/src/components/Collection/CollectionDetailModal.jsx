import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../../css/modal.css';
import { FaQrcode } from 'react-icons/fa';

const QRCodeModal = ({ item, isOpen, onClose }) => {
    if (!isOpen) return null;

    const itemData = {
        id: item.id,
        name: item.name,
        certificate: item.certificate,
        carat: item.carat,
        color: item.color,
        clarity: item.clarity
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content qr-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header qr-header">
                    <h2>{item.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body qr-body">
                    <div className="qr-container">
                        <QRCodeSVG
                            value={JSON.stringify(itemData)}
                            size={200}
                            level="H"
                            includeMargin={true}
                            imageSettings={{
                                src: "/path/to/your/logo.png",
                                x: undefined,
                                y: undefined,
                                height: 24,
                                width: 24,
                                excavate: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CollectionDetailModal = ({ item, isOpen, onClose }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    
    if (!isOpen) return null;
    if (showQRCode) {
        return <QRCodeModal 
            item={item} 
            isOpen={showQRCode} 
            onClose={() => setShowQRCode(false)} 
        />;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{item.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-image">
                        <img src={item.image} alt={item.name} />
                    </div>
                    <div className="modal-info">
                        <div className="info-section">
                            <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                Details
                                <FaQrcode 
                                    style={{ fontSize: '1.2em', cursor: 'pointer' }} 
                                    onClick={() => setShowQRCode(true)}
                                />
                            </h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Purchase Date:</span>
                                    <span>{new Date(item.purchaseDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Purchase Price:</span>
                                    <span>${item.purchasePrice}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Current Value:</span>
                                    <span>${item.currentValue}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Specifications</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Carat:</span>
                                    <span>{item.carat}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Color:</span>
                                    <span>{item.color}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Clarity:</span>
                                    <span>{item.clarity}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Certificate:</span>
                                    <span>{item.certificate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionDetailModal; 