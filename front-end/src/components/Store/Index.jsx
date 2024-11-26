import React, { useState } from 'react';
import ProductDetailModal from './ProductDetailModal.jsx';
import '../../css/layout.css';
import '../../css/search.css';
import '../../css/filter.css';
import '../../css/card.css';
import '../../css/store.css';

const storeData = [
    { 
        id: 1, 
        name: 'Diamond Ring', 
        price: 1000,
        image: '/assets/jewelry/jewelry_02.png',
        description: 'Beautiful diamond ring with 18K gold band',
        carat: 1.5,
        color: 'D',
        clarity: 'VS1'
    },
    { 
        id: 2, 
        name: 'Diamond Necklace', 
        price: 2000,
        image: '/assets/jewelry/jewelry_01.png',
        description: 'Elegant diamond necklace with platinum chain',
        carat: 2.0,
        color: 'E',
        clarity: 'VVS2'
    },
    // 添加更多商品...
];

const Store = ({ userType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const handlePriceChange = (event) => {
        setPriceRange([0, event.target.value]);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = storeData.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price <= priceRange[1];
        return matchesSearch && matchesPrice;
    });

    return (
        <div className="container">
            <div className="store-header">
                <h2>Diamond Store  {userType}</h2>
                <p>Find your perfect diamond jewelry</p>
            </div>
            
            <div className="store-filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <div className="filter-controls">
                    <select 
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="all">All Products</option>
                        <option value="rings">Rings</option>
                        <option value="necklaces">Necklaces</option>
                        <option value="earrings">Earrings</option>
                    </select>

                    <div className="price-filter">
                        <span>Max Price: ${priceRange[1]}</span>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className="price-range"
                        />
                    </div>
                </div>
            </div>

            <div className="collection-grid">
                {filteredProducts.map((product) => (
                    <div 
                        key={product.id} 
                        className="collection-card"
                        onClick={() => handleProductClick(product)}
                    >
                        <div className="collection-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="collection-info">
                            <h3>{product.name}</h3>
                            <p className="collection-description">{product.description}</p>
                            <div className="collection-specs">
                                <span>Carat: {product.carat}</span>
                                <span>Color: {product.color}</span>
                                <span>Clarity: {product.clarity}</span>
                            </div>
                            <div className="collection-details">
                                <div className="detail-row">
                                    <span>Price:</span>
                                    <span>${product.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Store; 