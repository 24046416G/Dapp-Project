import React from 'react';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/card.css';

const ProductCard = ({ product, onClick, userType }) => {
    const renderContent = () => {
        console.log('userType',userType);
        console.log('product',product);
        if (userType === USER_TYPES.JEWELRY_MAKER || userType === USER_TYPES.GRADING_LAB || userType === USER_TYPES.CUTTING_COMPANY) {
            const diamond = product.diamonds[0];
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
                            <span>Cut: {diamond.metadata.cut}</span>
                            <span>Polish: {diamond.metadata.polish}</span>
                            <span>Grading: {diamond.metadata.grading}</span>
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