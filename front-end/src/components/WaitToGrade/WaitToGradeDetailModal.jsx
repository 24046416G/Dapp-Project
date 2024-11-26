import React from 'react';
import '../../css/modal.css';

const WaitToGradeDetailModal = ({ diamond, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{diamond.mineralType}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Basic Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Batch Number:</span>
                                    <span>{diamond.batchNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span>From Company:</span>
                                    <span>{diamond.fromCompany}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Received Date:</span>
                                    <span>{new Date(diamond.receivedDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Weight:</span>
                                    <span>{diamond.weight} carats</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Cutting Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Cutting Date:</span>
                                    <span>{new Date(diamond.cuttingDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Cutting Tech:</span>
                                    <span>{diamond.cuttingTech}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Polishing Tech:</span>
                                    <span>{diamond.polishingTech}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Mining Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Mining Company:</span>
                                    <span>{diamond.miningInfo.company}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Date:</span>
                                    <span>{new Date(diamond.miningInfo.date).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Position:</span>
                                    <span>{diamond.miningInfo.position}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitToGradeDetailModal; 