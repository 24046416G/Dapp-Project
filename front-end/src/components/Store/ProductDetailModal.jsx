import React from 'react';
import '../../css/modal.css';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{product.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="modal-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="modal-info">
                        <div className="info-section">
                            <h3>Product Details</h3>
                            <p>{product.description}</p>
                        </div>
                        <div className="info-section">
                            <h3>Specifications</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span>Carat:</span>
                                    <span>{product.carat}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Color:</span>
                                    <span>{product.color}</span>
                                </div>
                                <div className="detail-item">
                                    <span>Clarity:</span>
                                    <span>{product.clarity}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Price</h3>
                            <p className="product-price">${product.price}</p>
                        </div>
                        <div className="modal-actions">
                            <button className="action-button submit-button">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal; 