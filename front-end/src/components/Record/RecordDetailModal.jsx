import React from 'react';
import '../../css/modal.css';

const RecordDetailModal = ({ record, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{record.mineralType}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Mining Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Mining Company:</span>
                                    <span>{record.miningCompany}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Date:</span>
                                    <span>{new Date(record.miningDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Position:</span>
                                    <span>{record.miningPosition}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Cutting Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Category:</span>
                                    <span>{record.category}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Cutting Date:</span>
                                    <span>{new Date(record.cuttingDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Weight:</span>
                                    <span>{record.weight} carats</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Technical Specifications</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Polishing Tech:</span>
                                    <span>{record.polishingTech}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Cutting Tech:</span>
                                    <span>{record.cuttingTech}</span>
                                </div>
                            </div>
                        </div>
                        {record.notes && (
                            <div className="info-section">
                                <h3>Notes</h3>
                                <p>{record.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordDetailModal; 