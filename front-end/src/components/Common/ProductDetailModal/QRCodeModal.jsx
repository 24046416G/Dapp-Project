import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '/src/css/modal.css';

const QRCodeModal = ({ product, isOpen, onClose }) => {
    if (!isOpen) return null;

    const productData = {
        id: product.id,
        name: product.name,
        diamonds: product.diamonds?.map(diamond => ({
            diamondId: diamond.diamondId,
            metadata: {
                carat: diamond.metadata.carat,
                color: diamond.metadata.color,
                cut: diamond.metadata.cut,
                polish: diamond.metadata.polish,
                grading: diamond.metadata.grading,
                origin: diamond.metadata.origin
            }
        }))
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content qr-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header qr-header">
                    <h2>{product.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body qr-body">
                    <div className="qr-container">
                        <QRCodeSVG
                            value={JSON.stringify(productData)}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal; 