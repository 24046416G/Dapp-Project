import React, { useState } from 'react';
import '../../css/modal.css';

const CuttingModal = ({ stone, isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        cuttingCompany: 'Diamond Cutting Corp',
        polishingTechnology: 'Traditional',
        cuttingTechnology: 'Laser',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Cut Raw Diamond</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="stone-info">
                        <h3>Raw Material Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Diamond Type:</span>
                                <span>{stone.diamondType || 'Diamond'}</span>
                            </div>
                            <div className="detail-item">
                                <span>Batch Number:</span>
                                <span>{stone.diamondId}</span>
                            </div>
                            <div className="detail-item">
                                <span>Weight:</span>
                                <span>{stone.metadata?.carat || 'N/A'} carats</span>
                            </div>
                            <div className="detail-item">
                                <span>Quality:</span>
                                <span>{stone.metadata?.quality || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span>Mining Company:</span>
                                <span>{stone.certificates?.miningCertificate?.companyId?.companyName || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span>Mining Time:</span>
                                <span>{stone.certificates?.miningCertificate?.timestamp ? 
                                    new Date(stone.certificates.miningCertificate.timestamp).toLocaleDateString() : 
                                    'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span>Origin:</span>
                                <span>{stone.metadata?.origin || 'N/A'}</span>
                            </div>
                            <div className="detail-item">
                                <span>Price:</span>
                                <span>${stone.price?.toLocaleString() || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Cutting Company</label>
                            <input
                                type="text"
                                name="cuttingCompany"
                                value={formData.cuttingCompany}
                                onChange={handleChange}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Polishing Technology</label>
                            <select 
                                name="polishingTechnology"
                                value={formData.polishingTechnology}
                                onChange={handleChange}
                            >
                                <option value="Traditional">Traditional</option>
                                <option value="Modern">Modern</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cutting Technology</label>
                            <select 
                                name="cuttingTechnology"
                                value={formData.cuttingTechnology}
                                onChange={handleChange}
                            >
                                <option value="Laser">Laser Cutting</option>
                                <option value="Mechanical">Mechanical Cutting</option>
                                <option value="Ultrasonic">Ultrasonic Cutting</option>
                                <option value="Plasma">Plasma Cutting</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="action-button cancel-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="action-button submit-button">
                                Start Cutting Process
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CuttingModal; 