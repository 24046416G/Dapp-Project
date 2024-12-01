import React from 'react';
import { USER_TYPES } from '../../../constants/userTypes';
import '../../../css/productCard.css';

const ProductCard = ({ product, onClick, userType }) => {
    const renderCustomerContent = () => (
        <>
            <div className="card-header">
                <h3>{product.name}</h3>
                <span className="price">${product.price?.toLocaleString()}</span>
            </div>
            <div className="card-body">
                {product.image ? (
                    <img 
                        src={"assets/jewelry/jewelry_01.png"}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="no-image">No Image Available</div>
                )}
                <p className="description">{product.description}</p>
                <div className="jewelry-specs">
                    <span>Type: {product.type}</span>
                    <span>Material: {product.material}</span>
                </div>
            </div>
        </>
    );

    const renderJewelryMakerContent = () => {
        const diamond = product.diamonds?.[0];
        return (
            <>
                <div className="card-header">
                    <h3>Diamond {diamond?.diamondId}</h3>
                    <span className="price">${product.price?.toLocaleString()}</span>
                </div>
                <div className="card-body">
                    {diamond?.metadata?.images ? (
                        <img 
                            src={diamond.metadata.images} 
                            alt={diamond.diamondId}
                            className="product-image"
                        />
                    ) : (
                        <div className="no-image">No Image Available</div>
                    )}
                    <div className="diamond-specs">
                        <span>Carat: {diamond?.metadata?.carat}</span>
                        <span>Color: {diamond?.metadata?.color}</span>
                        <span>Clarity: {diamond?.metadata?.clarity}</span>
                        <span>Cut: {diamond?.metadata?.cut}</span>
                        <span>Grade: {diamond?.metadata?.grading}</span>
                    </div>
                </div>
            </>
        );
    };

    const renderGradingLabContent = () => {
        const diamond = product.diamonds?.[0];
        return (
            <>
                <div className="card-header">
                    <h3>Cut Diamond {diamond?.diamondId}</h3>
                    <span className="price">${product.price?.toLocaleString()}</span>
                </div>
                <div className="card-body">
                    <div className="diamond-specs">
                        <span>Carat: {diamond?.metadata?.carat}</span>
                        <span>Cut Type: {diamond?.metadata?.cut}</span>
                        <span>Cut Quality: {diamond?.metadata?.cutQuality}</span>
                        <span>Polish: {diamond?.metadata?.polish}</span>
                        <span>Origin: {diamond?.metadata?.origin}</span>
                    </div>
                    <div className="certificate-info">
                        <p>Cutting Certificate: {diamond?.certificates?.cuttingCertificate?.status}</p>
                    </div>
                </div>
            </>
        );
    };

    const renderCuttingCompanyContent = () => {
        const diamond = product.diamonds?.[0];
        return (
            <>
                <div className="card-header">
                    <h3>Raw Diamond {diamond?.diamondId}</h3>
                    <span className="price">${product.price?.toLocaleString()}</span>
                </div>
                <div className="card-body">
                    <div className="diamond-specs">
                        <span>Carat: {diamond?.metadata?.carat}</span>
                        <span>Origin: {diamond?.metadata?.origin}</span>
                        <span>Quality: {diamond?.metadata?.quality}</span>
                    </div>
                    <div className="certificate-info">
                        <p>Mining Certificate: {diamond?.certificates?.miningCertificate?.status}</p>
                        <p>Mining Date: {new Date(diamond?.certificates?.miningCertificate?.timestamp).toLocaleDateString()}</p>
                    </div>
                </div>
            </>
        );
    };

    const renderContent = () => {
        switch(userType) {
            case USER_TYPES.CUSTOMER:
                return renderCustomerContent();
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
        <div className="product-card" onClick={() => onClick(product)}>
            {renderContent()}
        </div>
    );
};

export default ProductCard; 