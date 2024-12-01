import React, { useState } from 'react';
import '../../css/modal.css';

const WaitToGradeDetailModal = ({ diamond, isOpen, onClose, onSubmit }) => {
    const [gradingData, setGradingData] = useState({
        grading: '',
        imageData: null,
        certificateHash: ''
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setGradingData(prev => ({
                    ...prev,
                    imageData: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!gradingData.certificateHash.trim()) {
            alert('Please enter the IPFS Certificate Hash');
            return;
        }
        onSubmit(gradingData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Grade Diamond: {diamond.diamondId}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Grading Level:</label>
                            <select
                                value={gradingData.grading}
                                onChange={(e) => setGradingData(prev => ({
                                    ...prev,
                                    grading: e.target.value
                                }))}
                                required
                                className="grading-select"
                            >
                                <option value="">Select a grade</option>
                                <option value="I">Grade I</option>
                                <option value="II">Grade II</option>
                                <option value="III">Grade III</option>
                                <option value="IV">Grade IV</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>IPFS Certificate Hash:</label>
                            <input
                                type="text"
                                value={gradingData.certificateHash}
                                onChange={(e) => setGradingData(prev => ({
                                    ...prev,
                                    certificateHash: e.target.value
                                }))}
                                placeholder="Enter IPFS hash for the certificate"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Upload Images:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                required
                            />
                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={onClose}>Cancel</button>
                            <button type="submit">Submit Grading</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WaitToGradeDetailModal; 