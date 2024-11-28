import React, { useState } from 'react';
import '../../css/modal.css';

const SendToGradingModal = ({ record, isOpen, onClose, onConfirm }) => {
    const [gradingLab, setGradingLab] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        onConfirm(record.id, gradingLab);
        onClose();
    };

    if (!isOpen) return null;

    if (showConfirmation) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Confirm Transfer</h2>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to send this diamond to {gradingLab}?</p>
                        <div className="confirmation-details">
                            <p><strong>Diamond ID:</strong> {record.batchNumber}</p>
                            <p><strong>Grading Lab:</strong> {gradingLab}</p>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="action-button cancel-button"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Back
                            </button>
                            <button 
                                className="action-button submit-button"
                                onClick={handleConfirm}
                            >
                                Confirm Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Send to Grading Lab</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Grading Lab Name:</label>
                            <input
                                type="text"
                                value={gradingLab}
                                onChange={(e) => setGradingLab(e.target.value)}
                                required
                                placeholder="Enter grading lab name"
                            />
                        </div>
                        <div className="modal-actions">
                            <button 
                                type="button" 
                                className="action-button cancel-button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="action-button submit-button"
                                disabled={!gradingLab.trim()}
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SendToGradingModal; 