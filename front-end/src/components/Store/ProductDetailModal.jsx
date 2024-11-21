import React from 'react';
import '../../css/productModal.css';

const ProductDetailModal = ({ product, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="product-modal-overlay" onClick={onClose}>
            <div className="product-modal-content" onClick={e => e.stopPropagation()}>
                <div className="product-modal-header">
                    <h2>{product.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="product-modal-body">
                    <div className="product-modal-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-modal-info">
                        <div className="info-section">
                            <h3>Product Details</h3>
                            <p className="product-description">{product.description}</p>
                        </div>
                        <div className="info-section">
                            <h3>Specifications</h3>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <span className="spec-label">Carat:</span>
                                    <span className="spec-value">{product.carat}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Color:</span>
                                    <span className="spec-value">{product.color}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Clarity:</span>
                                    <span className="spec-value">{product.clarity}</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-label">Cut:</span>
                                    <span className="spec-value">{product.cut}</span>
                                </div>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>Price</h3>
                            <p className="product-price">${product.price.toLocaleString()}</p>
                        </div>
                        <div className="product-modal-actions">
                            <button className="action-button add-to-cart">Add to Cart</button>
                            <button className="action-button buy-now">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal; 