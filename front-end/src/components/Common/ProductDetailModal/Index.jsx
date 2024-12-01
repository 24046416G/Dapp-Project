import React, { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import QRCodeModal from '../QRCodeModal/Index.jsx';
import { USER_TYPES } from '../../../constants/userTypes';
import Button from '../Button/Index.jsx';
import '../../../css/modal.css';

const ProductDetailModal = ({ product, isOpen, onClose, userType, showBuyButton = false }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    
    if (!isOpen) return null;

    const handleBuy = async () => {
        try {
            // 获取当前用户信息
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                alert('Please login first!');
                return;
            }
            const user = JSON.parse(userStr);

            // 准备转移请求数据
            const transferData = {
                newOwnerId: user.id,
                price: product.price,
                certificateHash: user.id
            };

            console.log('Transfer data:', transferData);

            // 调用转移接口
            const response = await fetch(`http://localhost:3000/diamonds/${product.id}/transfer`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transferData)
            });
            console.log("response",response)
            if (!response.ok) {
                throw new Error('Transfer failed');
            }

            const result = await response.json();
            console.log('Transfer result:', result);

            alert('Purchase successful!');
            onClose();
            // 可以添加回调函数来刷新商店列表
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed: ' + error.message);
        }
    };

    const renderCustomerContent = () => (
        <>
            <div className="modal-image">
                <img 
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                />
            </div>
            <div className="modal-info">
                <div className="info-section">
                    <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Jewelry Details
                        <FaQrcode 
                            style={{ fontSize: '1.2em', cursor: 'pointer' }} 
                            onClick={() => setShowQRCode(true)}
                        />
                    </h3>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <span>Name:</span>
                            <span>{product.name}</span>
                        </div>
                        <div className="detail-item">
                            <span>Price:</span>
                            <span>${product.price?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Diamond Details</h3>
                    {product.diamonds?.map((diamond, index) => (
                        <div key={index} className="diamond-section">
                            <div className="detail-grid">
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
                                <div className="detail-item">
                                    <span>Clarity:</span>
                                    <span>{diamond.metadata?.clarity}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="info-section">
                    <h3>Certificates</h3>
                    <div className="certificate-grid">
                        {product.diamonds?.map((diamond, index) => (
                            <div key={index} className="certificate-section">
                                <p>Diamond {diamond.diamondId} Certificates:</p>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span>Mining:</span>
                                        <span>{diamond.certificates?.miningCertificate?.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Cutting:</span>
                                        <span>{diamond.certificates?.cuttingCertificate?.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span>Grading:</span>
                                        <span>{diamond.certificates?.gradingCertificate?.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    const renderJewelryMakerContent = () => {
        const diamond = product.diamonds?.[0];
        return (
            <>
                <div className="modal-image">
                    {diamond?.metadata?.images ? (
                        <img 
                            src={diamond.metadata.images}
                            alt={diamond.diamondId}
                            className="product-image"
                        />
                    ) : (
                        <div className="no-image">No Image Available</div>
                    )}
                </div>
                <div className="modal-info">
                    <div className="info-section">
                        <h3>Diamond Specifications</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Diamond ID:</span>
                                <span>{diamond?.diamondId}</span>
                            </div>
                            <div className="detail-item">
                                <span>Carat:</span>
                                <span>{diamond?.metadata?.carat}</span>
                            </div>
                            <div className="detail-item">
                                <span>Color:</span>
                                <span>{diamond?.metadata?.color}</span>
                            </div>
                            <div className="detail-item">
                                <span>Cut:</span>
                                <span>{diamond?.metadata?.cut}</span>
                            </div>
                            <div className="detail-item">
                                <span>Polish:</span>
                                <span>{diamond?.metadata?.polish}</span>
                            </div>
                            <div className="detail-item">
                                <span>Price:</span>
                                <span>${product.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Certificates</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Mining Certificate:</span>
                                <span>{diamond?.certificates?.miningCertificate?.status}</span>
                            </div>
                            <div className="detail-item">
                                <span>Cutting Certificate:</span>
                                <span>{diamond?.certificates?.cuttingCertificate?.status}</span>
                            </div>
                            <div className="detail-item">
                                <span>Grading Certificate:</span>
                                <span>{diamond?.certificates?.gradingCertificate?.status}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderGradingLabContent = () => {
        const diamond = product.diamonds?.[0];
        return (
            <>
                <div className="modal-info">
                    <div className="info-section">
                        <h3>Cut Diamond Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Diamond ID:</span>
                                <span>{diamond?.diamondId}</span>
                            </div>
                            <div className="detail-item">
                                <span>Cut:</span>
                                <span>{diamond?.metadata?.cut}</span>
                            </div>
                            <div className="detail-item">
                                <span>Polish:</span>
                                <span>{diamond?.metadata?.polish}</span>
                            </div>
                            <div className="detail-item">
                                <span>Price:</span>
                                <span>${product.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Cutting Certificate</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Status:</span>
                                <span>{diamond?.certificates?.cuttingCertificate?.status}</span>
                            </div>
                            <div className="detail-item">
                                <span>Date:</span>
                                <span>{new Date(diamond?.certificates?.cuttingCertificate?.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderCuttingCompanyContent = () => {
        const diamond = product.diamonds?.[0];
        return (
            <>
                <div className="modal-info">
                    <div className="info-section">
                        <h3>Raw Diamond Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Diamond ID:</span>
                                <span>{diamond?.diamondId}</span>
                            </div>
                            <div className="detail-item">
                                <span>Carat:</span>
                                <span>{diamond?.metadata?.carat}</span>
                            </div>
                            <div className="detail-item">
                                <span>Origin:</span>
                                <span>{diamond?.metadata?.origin}</span>
                            </div>
                            <div className="detail-item">
                                <span>Quality:</span>
                                <span>{diamond?.metadata?.quality}</span>
                            </div>
                            <div className="detail-item">
                                <span>Price:</span>
                                <span>${product.price?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Mining Certificate</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span>Status:</span>
                                <span>{diamond?.certificates?.miningCertificate?.status}</span>
                            </div>
                            <div className="detail-item">
                                <span>Mining Date:</span>
                                <span>{new Date(diamond?.certificates?.miningCertificate?.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
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
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{product.name || `Diamond ${product.diamonds?.[0]?.diamondId}`}</h2>
                        <button className="close-button" onClick={onClose}>&times;</button>
                    </div>
                    <div className="modal-body">
                        {renderContent()}
                        {showBuyButton && (
                            <div className="modal-footer">
                                <Button 
                                    onClick={handleBuy}
                                    className="buy-button"
                                    type="primary"
                                >
                                    Buy Now
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showQRCode && (
                <QRCodeModal 
                    product={product} 
                    isOpen={showQRCode} 
                    onClose={() => setShowQRCode(false)} 
                />
            )}
        </>
    );
};

export default ProductDetailModal; 