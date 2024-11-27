import React, { useState } from 'react';
import '../../css/jewelryInventory.css';
import JewelryDetailModal from './JewelryDetailModal.jsx';

const sampleJewelryData = [
    {
        id: 1,
        name: 'Diamond Ring',
        type: 'Ring',
        material: '18K White Gold',
        mainStone: {
            type: 'Diamond',
            weight: 1.2,
            color: 'D',
            clarity: 'VVS1',
            cut: 'Excellent'
        },
        sideStones: [
            { type: 'Diamond', weight: 0.1, quantity: 6 }
        ],
        creationDate: '2024-03-15',
        price: 8500,
        status: 'In Stock',
        designNumber: 'JR-2024-001',
        description: 'Classic solitaire engagement ring with pavé diamond band'
    },
    {
        id: 2,
        name: 'Sapphire Necklace',
        type: 'Necklace',
        material: '18K Yellow Gold',
        mainStone: {
            type: 'Sapphire',
            weight: 2.5,
            color: 'Royal Blue',
            origin: 'Ceylon'
        },
        sideStones: [
            { type: 'Diamond', weight: 0.05, quantity: 12 }
        ],
        creationDate: '2024-03-10',
        price: 6800,
        status: 'In Stock',
        designNumber: 'JN-2024-015',
        description: 'Elegant sapphire pendant surrounded by diamond halo'
    }
];

const JewelryInventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedJewelry, setSelectedJewelry] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
    };

    const handleJewelryClick = (jewelry) => {
        setSelectedJewelry(jewelry);
        setIsDetailModalOpen(true);
    };

    const filteredJewelry = sampleJewelryData.filter((jewelry) => {
        const matchesSearch = jewelry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            jewelry.designNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || jewelry.type.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="jewelry-inventory-container">
            <div className="inventory-header">
                <div className="header-content">
                    <div>
                        <h2>Jewelry Inventory</h2>
                        <p>Manage your jewelry collection</p>
                    </div>
                </div>
            </div>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by name or design number..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <select 
                    value={filterType}
                    onChange={handleFilterChange}
                    className="filter-select"
                >
                    <option value="all">All Types</option>
                    <option value="ring">Rings</option>
                    <option value="necklace">Necklaces</option>
                    <option value="bracelet">Bracelets</option>
                    <option value="earring">Earrings</option>
                </select>
            </div>

            <div className="jewelry-grid">
                {filteredJewelry.map((jewelry) => (
                    <div 
                        key={jewelry.id} 
                        className="jewelry-card"
                        onClick={() => handleJewelryClick(jewelry)}
                    >
                        <div className="jewelry-main-info">
                            <div>
                                <h3>{jewelry.name}</h3>
                                <p className="design-number">{jewelry.designNumber}</p>
                            </div>
                            <span className={`status-badge ${jewelry.status.toLowerCase().replace(' ', '-')}`}>
                                {jewelry.status}
                            </span>
                        </div>

                        <div className="jewelry-details">
                            <div className="detail-row">
                                <span>Type:</span>
                                <span>{jewelry.type}</span>
                            </div>
                            <div className="detail-row">
                                <span>Material:</span>
                                <span>{jewelry.material}</span>
                            </div>
                            <div className="detail-row">
                                <span>Main Stone:</span>
                                <span>{jewelry.mainStone.type} ({jewelry.mainStone.weight}ct)</span>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <span>${jewelry.price.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="jewelry-actions">
                            <button 
                                className="action-button view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleJewelryClick(jewelry);
                                }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedJewelry && (
                <JewelryDetailModal
                    jewelry={selectedJewelry}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default JewelryInventory; 