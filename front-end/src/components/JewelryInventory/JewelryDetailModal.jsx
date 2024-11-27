import React from 'react';
import '../../css/modal.css';

const JewelryDetailModal = ({ jewelry, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{jewelry.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Basic Information</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Design Number:</span>
                                    <span>{jewelry.designNumber}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Type:</span>
                                    <span>{jewelry.type}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Material:</span>
                                    <span>{jewelry.material}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Status:</span>
                                    <span>{jewelry.status}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Creation Date:</span>
                                    <span>{new Date(jewelry.creationDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Price:</span>
                                    <span>${jewelry.price.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Main Stone Details</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Type:</span>
                                    <span>{jewelry.mainStone.type}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Weight:</span>
                                    <span>{jewelry.mainStone.weight} ct</span>
                                </div>
                                {jewelry.mainStone.color && (
                                    <div className="detail-item">
                                        <span>Color:</span>
                                        <span>{jewelry.mainStone.color}</span>
                                    </div>
                                )}
                                {jewelry.mainStone.clarity && (
                                    <div className="detail-item">
                                        <span>Clarity:</span>
                                        <span>{jewelry.mainStone.clarity}</span>
                                    </div>
                                )}
                                {jewelry.mainStone.cut && (
                                    <div className="detail-item">
                                        <span>Cut:</span>
                                        <span>{jewelry.mainStone.cut}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {jewelry.sideStones && jewelry.sideStones.length > 0 && (
                            <div className="info-section">
                                <h3>Side Stones</h3>
                                <div className="detail-grid">
                                    {jewelry.sideStones.map((stone, index) => (
                                        <div key={index} className="detail-item">
                                            <span>{stone.type}:</span>
                                            <span>{stone.quantity}x {stone.weight}ct</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="info-section">
                            <h3>Description</h3>
                            <p className="description">{jewelry.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JewelryDetailModal; 