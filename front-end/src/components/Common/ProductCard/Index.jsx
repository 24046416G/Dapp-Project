import React from 'react';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/card.css';

const ProductCard = ({ product, onClick, userType }) => {
    const renderContent = () => {
        if (userType === USER_TYPES.JEWELER) {
            const diamond = product[0];
            return (
                <>
                    <div className="card-header">
                        <h3>{product.name}</h3>
                        <span className="price">${product.price}</span>
                    </div>
                    <div className="card-body">
                        {product.image ? (
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="product-image"
                            />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                        <div className="specs">
                            <span>Carat: {diamond.metadata.carat}</span>
                            <span>Color: {diamond.metadata.color}</span>
                            <span>Cut: {diamond.metadata.cut}</span>
                            <span>Polish: {diamond.metadata.polish}</span>
                            <span>Grading: {diamond.metadata.grading}</span>
                        </div>
                    </div>
                </>
            );
        } else {
            // 原有的珠宝展示逻辑
            return (
                <>
                    <div className="card-header">
                        <h3>{product.name}</h3>
                        <span className="price">${product.price}</span>
                    </div>
                    <div className="card-body">
                        {product.image ? (
                            <img 
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                            />
                        ) : (
                            <div className="no-image">No Image Available</div>
                        )}
                        <p className="description">{product.description}</p>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="product-card" onClick={() => onClick(product)}>
            {renderContent()}
        </div>
    );
};

export default ProductCard; 