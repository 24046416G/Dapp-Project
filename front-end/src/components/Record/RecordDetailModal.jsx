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
                            <h3>Record Details</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Batch Number:</span>
                                    <span>{record.batchNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Location:</span>
                                    <span>{record.location}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Mining Date:</span>
                                    <span>{new Date(record.mineDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Status:</span>
                                    <span>{record.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Specifications</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Weight:</span>
                                    <span>{record.weight} carats</span>
                                </div>
                                <div className="detail-item">
                                    <span>Quality:</span>
                                    <span>{record.quality}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Color:</span>
                                    <span>{record.color}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Clarity:</span>
                                    <span>{record.clarity}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Location Details</h3>
                            <div className="detail-item">
                                <span>Coordinates:</span>
                                <span>{record.coordinates}</span>
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