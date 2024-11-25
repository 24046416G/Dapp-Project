import React, { useState } from 'react';
import '../../css/buyRawStones.css';

const rawStonesData = [
    {
        id: 1,
        batchNumber: 'RAW-2024-003',
        mineralType: 'Diamond',
        weight: 4.2,
        quality: 'High',
        miningCompany: 'Rio Tinto',
        miningTime: '2024-03-10',
        miningPosition: 'N 22°35′24″ E 119°28′12″ (Argyle Mine)',
        price: 18500,
        status: 'For Sale',
        description: 'Premium quality raw diamond with exceptional clarity potential',
        origin: 'Australia'
    },
    {
        id: 2,
        batchNumber: 'RAW-2024-004',
        mineralType: 'Diamond',
        weight: 3.8,
        quality: 'Medium',
        miningCompany: 'Petra Diamonds',
        miningTime: '2024-03-08',
        miningPosition: 'S 25°43′60″ E 27°07′48″ (Cullinan Mine)',
        price: 15800,
        status: 'For Sale',
        description: 'Well-formed octahedral crystal structure',
        origin: 'South Africa'
    }
];

const BuyRawStones = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(20000);
    const [qualityFilter, setQualityFilter] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePriceRangeChange = (event) => {
        setPriceRange(event.target.value);
    };

    const handleQualityChange = (event) => {
        setQualityFilter(event.target.value);
    };

    const handlePurchase = (stone) => {
        // 这里添加购买逻辑
        console.log('Purchasing stone:', stone);
        alert(`Initiating purchase for ${stone.batchNumber}`);
    };

    const filteredStones = rawStonesData.filter((stone) => {
        const matchesSearch = 
            stone.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stone.miningCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stone.origin.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrice = stone.price <= priceRange;
        const matchesQuality = qualityFilter === 'all' || stone.quality === qualityFilter;

        return matchesSearch && matchesPrice && matchesQuality;
    });

    return (
        <div className="buy-stones-container">
            <div className="stones-header">
                <div className="header-content">
                    <div>
                        <h2>Raw Stones Market</h2>
                        <p>Browse and purchase raw diamonds for cutting</p>
                    </div>
                </div>
            </div>

            <div className="stones-filters">
                <input
                    type="text"
                    placeholder="Search by batch number, mining company, or origin..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <div className="filter-controls">
                    <div className="price-filter">
                        <label>Maximum Price: ${priceRange}</label>
                        <input
                            type="range"
                            min="5000"
                            max="50000"
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            className="price-range"
                        />
                    </div>

                    <select 
                        value={qualityFilter}
                        onChange={handleQualityChange}
                        className="quality-select"
                    >
                        <option value="all">All Qualities</option>
                        <option value="High">High Quality</option>
                        <option value="Medium">Medium Quality</option>
                        <option value="Low">Low Quality</option>
                    </select>
                </div>
            </div>

            <div className="stones-grid">
                {filteredStones.map((stone) => (
                    <div key={stone.id} className="stone-card">
                        <div className="stone-header">
                            <h3>{stone.mineralType}</h3>
                            <span className="batch-number">{stone.batchNumber}</span>
                        </div>
                        <div className="stone-details">
                            <div className="detail-row">
                                <span>Weight:</span>
                                <span>{stone.weight} carats</span>
                            </div>
                            <div className="detail-row">
                                <span>Quality:</span>
                                <span>{stone.quality}</span>
                            </div>
                            <div className="detail-row">
                                <span>Origin:</span>
                                <span>{stone.origin}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Company:</span>
                                <span>{stone.miningCompany}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Time:</span>
                                <span>{new Date(stone.miningTime).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-row">
                                <span>Mining Position:</span>
                                <span>{stone.miningPosition}</span>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <span className="price">${stone.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="stone-description">
                            <p>{stone.description}</p>
                        </div>
                        <div className="stone-actions">
                            <button 
                                className="purchase-button"
                                onClick={() => handlePurchase(stone)}
                            >
                                Purchase
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyRawStones; 