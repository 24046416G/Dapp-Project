import React from 'react';
import '../../../css/certificateHash.css';

const formatHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const CertificateHash = ({ hash, label }) => {
    const handleClick = () => {
        if (hash) {
            navigator.clipboard.writeText(hash);
            alert('Hash copied to clipboard!');
        }
    };

    return (
        <div className="cert-row">
            <span className="cert-label">{label}</span>
            <span 
                className="cert-value hash-value" 
                title={hash}
                onClick={handleClick}
            >
                {formatHash(hash)}
            </span>
        </div>
    );
};

export default CertificateHash; 