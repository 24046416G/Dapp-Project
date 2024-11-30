import React, { useState } from 'react';
import Button from '../Button/Index.jsx';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/modal.css';

const AddRecordModal = ({ isOpen, onClose, userType }) => {
    const getInitialFormData = () => {
        switch(userType) {
            case USER_TYPES.MINING_COMPANY:
                return {
                    diamondId: '',
                    weight: '',
                    quality: '',
                    origin: '',
                    price: '',
                    miningDate: '',
                    minerSignature: '',
                    certificateIpfsHash: ''
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
        
        // 数据类型转换
        const parsedData = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            weight: parseFloat(formData.weight) || 0
        };
        
        // 整理数据格式用于注册
        const submitData = {
            diamondData: {
                id: parsedData.diamondId,
                carat: parsedData.weight,  // 已转换为数字
                color: parsedData.color,
                clarity: parsedData.quality,
                origin: parsedData.origin,
                miningDate: new Date().toISOString()
            },
            minerSignature: parsedData.minerSignature,
            certificateIpfsHash: parsedData.certificateIpfsHash
        };

        console.log("Formatted data for register:", submitData);

        try {
            // 调用注册接口
            const registerResponse = await fetch('http://localhost:3001/api/diamond/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            if (!registerResponse.ok) {
                throw new Error('Failed to register diamond');
            }

            const registerResult = await registerResponse.json();
            console.log('Register API Response:', registerResult);

            // 准备 mine 接口的数据
            const mineData = {
                diamondId: submitData.diamondData.id,
                diamondType: 'NATURAL',
                currentOwner: 'TESTCurrentMiningOwner',
                price: parsedData.price,  // 已转换为数字
                certificateHash: registerResult.data.diamondHash,
                metadata: {
                    origin: submitData.diamondData.origin,
                    color: submitData.diamondData.color,
                    carat: submitData.diamondData.carat  // 已转换为数字
                }
            };

            console.log("Formatted data for mine:", mineData);

            // 调用 mine 接口
            const mineResponse = await fetch('http://localhost:3000/diamonds/mine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mineData)
            });

            if (!mineResponse.ok) {
                throw new Error('Failed to mine diamond');
            }

            const mineResult = await mineResponse.json();
            console.log('Mine API Response:', mineResult);

            // 成功后关闭模态框
            onClose();
        } catch (error) {
            console.error('Error processing diamond:', error);
            alert('Failed to process diamond: ' + error.message);
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
                            <label>Miner  Signature</label>
                            <input
                                type="text"
                                name="minerSignature"
                                value={formData.minerSignature}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Weight (Carat)</label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                required
                            />
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
                            <label>Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>IPFS Hash</label>
                            <input
                                type="text"
                                name="certificateIpfsHash"
                                value={formData.certificateIpfsHash}
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