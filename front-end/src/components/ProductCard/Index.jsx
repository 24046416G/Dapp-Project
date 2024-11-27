import React from 'react';
import '../../css/card.css';
import PropTypes from 'prop-types';

const ProductCard = ({ product, onClick }) => {
    return (
        <div 
            className="collection-card"
            onClick={() => onClick(product)}
        >
            <div className="collection-image">
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.name}
                    />
                ) : (
                    <div className="no-image">No Image Available</div>
                )}
            </div>
            <div className="collection-info">
                <h3>{product.name}</h3>
                <p className="collection-description">{product.description}</p>
                <div className="collection-details">
                    <div className="detail-row">
                        <span>Price:</span>
                        <span>${product.price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
        image: PropTypes.string
    }).isRequired,
    onClick: PropTypes.func.isRequired
};

export default ProductCard; 