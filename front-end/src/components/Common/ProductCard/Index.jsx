import React from 'react';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/card.css';

const ProductCard = ({ product, onClick, userType }) => {
    const renderContent = () => {
        console.log('userType',userType);
        if (userType === USER_TYPES.JEWELRY_MAKER) {
            const jewelry = product[0];
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
                            <span>Carat: {jewelry.metadata.carat}</span>
                            <span>Color: {jewelry.metadata.color}</span>
                            <span>Cut: {jewelry.metadata.cut}</span>
                            <span>Polish: {jewelry.metadata.polish}</span>
                            <span>Grading: {jewelry.metadata.grading}</span>
                        </div>
                    </div>
                </>
            );
        } else if (userType === USER_TYPES.CUSTOMER) {
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