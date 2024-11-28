import React, { useState } from 'react';
import Button from '../Button/Index.jsx';
import '../../../css/modal.css';

const AddRecordModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        diamondId: '',
        weight: '',
        quality: '',
        origin: '',
        price: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New Mining Record</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-group">
                            <label>Diamond ID</label>
                            <input
                                type="text"
                                name="diamondId"
                                value={formData.diamondId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Weight (Carat)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Quality</label>
                            <select
                                name="quality"
                                value={formData.quality}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Quality</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Origin</label>
                            <input
                                type="text"
                                name="origin"
                                value={formData.origin}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="modal-footer">
                            <Button 
                                type="primary"
                                onClick={handleSubmit}
                            >
                                Add Record
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRecordModal; 