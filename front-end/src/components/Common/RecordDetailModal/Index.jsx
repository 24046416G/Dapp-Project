import React from 'react';
import '../../../css/recordCard.css';
import '../../../css/modal.css';

const RecordDetailModal = ({ record, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{record.type} Record Details</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Basic Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Diamond ID:</span>
                                    <span>{record.diamondId}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Date:</span>
                                    <span>{new Date(record.date).toLocaleString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Status:</span>
                                    <span>{record.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Transaction Details</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>From:</span>
                                    <span>{record.from}</span>
                                </div>
                                <div className="detail-item">
                                    <span>To:</span>
                                    <span>{record.to}</span>
                                </div>
                                {record.price && (
                                    <div className="detail-item">
                                        <span>Price:</span>
                                        <span>${record.price}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {record.metadata && (
                            <div className="info-section">
                                <h3>Additional Information</h3>
                                <div className="detail-grid">
                                    {Object.entries(record.metadata).map(([key, value]) => (
                                        <div key={key} className="detail-item">
                                            <span>{key}:</span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordDetailModal; 