import React, { useState } from 'react';
import Button from '../Button/Index.jsx';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/modal.css';

const AddRecordModal = ({ isOpen, onClose, onSubmit, userType }) => {
    const getInitialFormData = () => {
        switch(userType) {
            case USER_TYPES.MINING_COMPANY:
                return {
                    diamondId: '',
                    weight: '',
                    quality: '',
                    origin: '',
                    price: '',
                    miningLocation: '',
                    miningDate: ''
                };
            case USER_TYPES.CUTTING_COMPANY:
                return {
                    diamondId: '',
                    cutType: '',
                    cutGrade: '',
                    polishGrade: '',
                    symmetryGrade: '',
                    finalWeight: ''
                };
            case USER_TYPES.GRADING_LAB:
                return {
                    diamondId: '',
                    clarity: '',
                    color: '',
                    cut: '',
                    polish: '',
                    symmetry: '',
                    fluorescence: ''
                };
            default:
                return {
                    diamondId: '',
                    description: ''
                };
        }
    };

    const [formData, setFormData] = useState(getInitialFormData());

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form data for user type:", userType);
        console.log("Form data:", formData);
        
        try {
            console.log("Fetching IPFS data...");
            const response = await fetch('http://localhost:8080/ipfs/Qmbm5bUsJF9TQdrZbzYvyVpVgcB5w3TBDXiJVu7DCZJWC3');
            const data = await response.text();
            console.log('IPFS Data:', data);

            onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderFormFields = () => {
        switch(userType) {
            case USER_TYPES.MINING_COMPANY:
                return (
                    <>
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
                            <label>Origin</label>
                            <input
                                type="text"
                                name="miningLocation"
                                value={formData.miningLocation}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Color</label>
                            <input
                                type="text"
                                name="miningLocation"
                                value={formData.miningLocation}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="text"
                                name="diamondId"
                                value={formData.diamondId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>IPFS Hash</label>
                            <input
                                type="text"
                                name="diamondId"
                                value={formData.diamondId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                );
            case USER_TYPES.CUTTING_COMPANY:
                return (
                    <>
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
                            <label>Cut Type</label>
                            <select name="cutType" value={formData.cutType} onChange={handleInputChange} required>
                                <option value="">Select Cut Type</option>
                                <option value="round">Round Brilliant</option>
                                <option value="princess">Princess</option>
                                <option value="emerald">Emerald</option>
                                <option value="oval">Oval</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Final Weight</label>
                            <input
                                type="number"
                                name="finalWeight"
                                value={formData.finalWeight}
                                onChange={handleInputChange}
                                step="0.01"
                                required
                            />
                        </div>
                    </>
                );
            case USER_TYPES.GRADING_LAB:
                return (
                    <>
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
                            <label>Color Grade</label>
                            <select name="color" value={formData.color} onChange={handleInputChange} required>
                                <option value="">Select Color</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                                <option value="F">F</option>
                                <option value="G">G</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Clarity Grade</label>
                            <select name="clarity" value={formData.clarity} onChange={handleInputChange} required>
                                <option value="">Select Clarity</option>
                                <option value="FL">FL</option>
                                <option value="IF">IF</option>
                                <option value="VVS1">VVS1</option>
                                <option value="VVS2">VVS2</option>
                            </select>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add New {userType} Record</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="form-grid">
                        {renderFormFields()}
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