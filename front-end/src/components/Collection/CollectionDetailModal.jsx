import React from 'react';
import '../../css/modal.css';

const CollectionDetailModal = ({ item, isOpen, onClose }) => {
    if (!isOpen) return null;

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
                            <h3>Details</h3>
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