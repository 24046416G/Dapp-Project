import React from 'react';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/modal.css';

const RecordDetailModal = ({ record, isOpen, onClose, userType }) => {
    if (!isOpen) return null;
    console.log('userType in record detail modal',userType);
    const renderMiningCompanyContent = () => (
        <div className="modal-info">
            <div className="info-section">
                <h3>Mining Details</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Diamond ID:</span>
                        <span>{record.diamondId}</span>
                    </div>
                    <div className="detail-item">
                        <span>Weight:</span>
                        <span>{record.metadata?.carat} carats</span>
                    </div>
                    <div className="detail-item">
                        <span>Origin:</span>
                        <span>{record.metadata?.origin}</span>
                    </div>
                    <div className="detail-item">
                        <span>Mining Date:</span>
                        <span>{new Date(record.certificates?.miningCertificate?.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h3>Certificate Information</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Certificate Hash:</span>
                        <span>{record.certificates?.miningCertificate?.certificateHash}</span>
                    </div>
                    <div className="detail-item">
                        <span>Status:</span>
                        <span>{record.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJewelryMakerContent = () => (
        <div className="modal-info">
            <div className="info-section">
                <h3>Jewelry Details</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Jewelry ID:</span>
                        <span>{record.jewelryId}</span>
                    </div>
                    <div className="detail-item">
                        <span>Name:</span>
                        <span>{record.name}</span>
                    </div>
                    <div className="detail-item">
                        <span>Price:</span>
                        <span>${record.price?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h3>Diamonds Used</h3>
                {record.diamonds?.map((diamond, index) => (
                    <div key={index} className="detail-grid">
                        <div className="detail-item">
                            <span>Diamond ID:</span>
                            <span>{diamond.diamondId}</span>
                        </div>
                        <div className="detail-item">
                            <span>Carat:</span>
                            <span>{diamond.metadata?.carat}</span>
                        </div>
                        <div className="detail-item">
                            <span>Color:</span>
                            <span>{diamond.metadata?.color}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGradingLabContent = () => (
        <div className="modal-info">
            <div className="info-section">
                <h3>Grading Details</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Diamond ID:</span>
                        <span>{record.diamondId}</span>
                    </div>
                    <div className="detail-item">
                        <span>Color Grade:</span>
                        <span>{record.metadata?.color}</span>
                    </div>
                    <div className="detail-item">
                        <span>Clarity Grade:</span>
                        <span>{record.metadata?.clarity}</span>
                    </div>
                    <div className="detail-item">
                        <span>Cut Grade:</span>
                        <span>{record.metadata?.cut}</span>
                    </div>
                    <div className="detail-item">
                        <span>Polish:</span>
                        <span>{record.metadata?.polish}</span>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h3>Certificate Information</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Certificate Hash:</span>
                        <span>{record.certificates?.gradingCertificate?.certificateHash}</span>
                    </div>
                    <div className="detail-item">
                        <span>Grading Date:</span>
                        <span>{new Date(record.certificates?.gradingCertificate?.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCuttingCompanyContent = () => (
        <div className="modal-info">
            <div className="info-section">
                <h3>Cutting Details</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Diamond ID:</span>
                        <span>{record.diamondId}</span>
                    </div>
                    <div className="detail-item">
                        <span>Cut Type:</span>
                        <span>{record.metadata?.cut}</span>
                    </div>
                    <div className="detail-item">
                        <span>Polish:</span>
                        <span>{record.metadata?.polish}</span>
                    </div>
                    <div className="detail-item">
                        <span>Symmetry:</span>
                        <span>{record.metadata?.symmetry}</span>
                    </div>
                </div>
            </div>

            <div className="info-section">
                <h3>Certificate Information</h3>
                <div className="detail-grid">
                    <div className="detail-item">
                        <span>Certificate Hash:</span>
                        <span>{record.certificates?.cuttingCertificate?.certificateHash}</span>
                    </div>
                    <div className="detail-item">
                        <span>Cutting Date:</span>
                        <span>{new Date(record.certificates?.cuttingCertificate?.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(userType) {
            case USER_TYPES.MINING_COMPANY:
                return renderMiningCompanyContent();
            case USER_TYPES.JEWELRY_MAKER:
                return renderJewelryMakerContent();
            case USER_TYPES.GRADING_LAB:
                return renderGradingLabContent();
            case USER_TYPES.CUTTING_COMPANY:
                return renderCuttingCompanyContent();
            default:
                return null;
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{userType === USER_TYPES.JEWELRY_MAKER ? 
                        `Jewelry Record: ${record.name}` : 
                        `Diamond Record: ${record.diamondId}`}
                    </h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default RecordDetailModal; 