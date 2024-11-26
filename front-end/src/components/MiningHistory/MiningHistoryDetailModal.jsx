import React from 'react';
import '../../css/modal.css';

const MiningHistoryDetailModal = ({ history, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{history.mineralType}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Mining Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Mining Company:</span>
                                    <span>{history.miningCompany}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Date:</span>
                                    <span>{new Date(history.miningDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Position:</span>
                                    <span>{history.miningPosition}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Transfer Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Transfer Date:</span>
                                    <span>{new Date(history.transferDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Transferred To:</span>
                                    <span>{history.transferredTo}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Price:</span>
                                    <span>${history.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Diamond Specifications</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Category:</span>
                                    <span>{history.category}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Weight:</span>
                                    <span>{history.weight} carats</span>
                                </div>
                                <div className="detail-item">
                                    <span>Batch Number:</span>
                                    <span>{history.batchNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiningHistoryDetailModal; 