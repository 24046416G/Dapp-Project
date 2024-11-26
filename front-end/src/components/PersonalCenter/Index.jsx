import React, { useState } from 'react';
import Wallet from '../Wallet/Index.jsx';
import Collection from '../Collection/Index.jsx';
import '../../css/personalCenter.css';

const PersonalCenter = () => {
    const [activeTab, setActiveTab] = useState('collection');

    return (
        <div className="container">
            <div className="tabs">
                <button 
                    className={`tab-button ${activeTab === 'collection' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collection')}
                >
                    My Collection
                </button>
                <button 
                    className={`tab-button ${activeTab === 'wallet' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wallet')}
                >
                    My Wallet
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'collection' ? <Collection /> : <Wallet />}
            </div>
        </div>
    );
};

export default PersonalCenter; 