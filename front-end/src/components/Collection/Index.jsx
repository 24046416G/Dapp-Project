import React, { useState } from 'react';
import '../../css/collection.css';

const collectionData = [
    { 
        id: 1, 
        name: 'Vintage Diamond Ring', 
        purchasePrice: 1500,
        currentValue: 1800,
        image: 'https://via.placeholder.com/150',
        description: 'A beautiful vintage diamond ring from 1950s',
        purchaseDate: '2023-10-15',
        carat: 1.2,
        color: 'D',
        clarity: 'VVS1',
        certificate: 'GIA-123456'
    },
    { 
        id: 2, 
        name: 'Modern Diamond Necklace', 
        purchasePrice: 2500,
        currentValue: 2800,
        image: 'https://via.placeholder.com/150',
        description: 'Contemporary diamond necklace with platinum chain',
        purchaseDate: '2023-11-20',
        carat: 1.8,
        color: 'E',
        clarity: 'VS1',
        certificate: 'GIA-789012'
    },
    // 可以添加更多收藏品...
];

const Collection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('purchaseDate');
    const [filterBy, setFilterBy] = useState('all');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
    };

    const filteredAndSortedItems = collectionData
        .filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            if (filterBy === 'all') return matchesSearch;
            return matchesSearch && item.clarity === filterBy;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'value':
                    return b.currentValue - a.currentValue;
                case 'carat':
                    return b.carat - a.carat;
                case 'purchaseDate':
                    return new Date(b.purchaseDate) - new Date(a.purchaseDate);
                default:
                    return 0;
            }
        });

    const totalValue = filteredAndSortedItems.reduce((sum, item) => sum + item.currentValue, 0);

    return (
        <div className="collection-container">
            <div className="collection-header">
                <div className="header-content">
                    <div>
                        <h2>My Diamond Collection</h2>
                        <p>Total Collection Value: ${totalValue.toLocaleString()}</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Total Items</span>
                            <span className="stat-value">{filteredAndSortedItems.length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Avg. Value</span>
                            <span className="stat-value">
                                ${(totalValue / filteredAndSortedItems.length || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="collection-filters">
                <input
                    type="text"
                    placeholder="Search in collection..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <div className="filter-controls">
                    <select 
                        value={sortBy}
                        onChange={handleSortChange}
                        className="filter-select"
                    >
                        <option value="purchaseDate">Sort by Date</option>
                        <option value="value">Sort by Value</option>
                        <option value="carat">Sort by Carat</option>
                    </select>

                    <select 
                        value={filterBy}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="all">All Clarity</option>
                        <option value="VVS1">VVS1</option>
                        <option value="VVS2">VVS2</option>
                        <option value="VS1">VS1</option>
                        <option value="VS2">VS2</option>
                    </select>
                </div>
            </div>

            <div className="collection-grid">
                {filteredAndSortedItems.map((item) => (
                    <div key={item.id} className="collection-card">
                        <div className="collection-image">
                            <img src={item.image} alt={item.name} />
                            <div className="value-change">
                                <span className={item.currentValue > item.purchasePrice ? 'positive' : 'negative'}>
                                    {((item.currentValue - item.purchasePrice) / item.purchasePrice * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="collection-info">
                            <h3>{item.name}</h3>
                            <p className="collection-description">{item.description}</p>
                            <div className="collection-specs">
                                <span>Carat: {item.carat}</span>
                                <span>Color: {item.color}</span>
                                <span>Clarity: {item.clarity}</span>
                            </div>
                            <div className="collection-details">
                                <div className="detail-row">
                                    <span>Purchase Date:</span>
                                    <span>{new Date(item.purchaseDate).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Purchase Price:</span>
                                    <span>${item.purchasePrice}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Current Value:</span>
                                    <span>${item.currentValue}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Certificate:</span>
                                    <span>{item.certificate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collection; 