import React, { useState } from 'react';
import '../../css/recordModal.css';

const AddRecordModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        mineralType: '',
        location: '',
        mineDate: '',
        weight: '',
        quality: 'High',
        color: '',
        clarity: 'VVS1',
        status: 'Pending',
        notes: '',
        coordinates: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRecord = {
            ...formData,
            id: Date.now(),
            batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
            weight: parseFloat(formData.weight)
        };
        onSubmit(newRecord);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Mining Record</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="record-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Mineral Type</label>
                            <input
                                type="text"
                                name="mineralType"
                                value={formData.mineralType}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Diamond"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Kimberley, South Africa"
                            />
                        </div>

                        <div className="form-group">
                            <label>Mining Date</label>
                            <input
                                type="date"
                                name="mineDate"
                                value={formData.mineDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Weight (carats)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Quality</label>
                            <select name="quality" value={formData.quality} onChange={handleChange}>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                required
                                placeholder="e.g., D"
                            />
                        </div>

                        <div className="form-group">
                            <label>Clarity</label>
                            <select name="clarity" value={formData.clarity} onChange={handleChange}>
                                <option value="VVS1">VVS1</option>
                                <option value="VVS2">VVS2</option>
                                <option value="VS1">VS1</option>
                                <option value="VS2">VS2</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="Pending">Pending</option>
                                <option value="In Processing">In Processing</option>
                                <option value="Processed">Processed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Coordinates</label>
                            <input
                                type="text"
                                name="coordinates"
                                value={formData.coordinates}
                                onChange={handleChange}
                                placeholder="e.g., S 28°44′46″ E 24°46′46″"
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any additional notes here..."
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Add Record
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRecordModal; 