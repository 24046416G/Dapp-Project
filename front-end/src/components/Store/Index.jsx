import React, { useState, useEffect } from 'react';
import ProductDetailModal from '../Common/ProductDetailModal/Index.jsx';
import ProductCard from '../Common/ProductCard/Index.jsx';
import '../../css/layout.css';
import '../../css/search.css';
import '../../css/filter.css';
import '../../css/store.css';

const Store = ({ userType }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 30000]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 获取珠宝数据
    useEffect(() => {
        const fetchJewelries = async () => {
            try {
                const response = await fetch('http://localhost:3000/jewelries/all');
                if (!response.ok) {
                    throw new Error('Failed to fetch jewelries');
                }
                const data = await response.json();
                console.log(data)
                const jewelriesArray = Array.isArray(data) ? data : data.jewelries || [];
                setProducts(jewelriesArray);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching jewelries:', error);
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchJewelries();
    }, []);

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

    const filteredProducts = Array.isArray(products) ? products.filter((product) => {
        const matchesPrice = product.price <= priceRange[1];
        console.log('Single product:', product);
        return matchesPrice;
    }) : [];

    console.log('Filtered products:', filteredProducts);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <div className="store-header">
                <h2>Diamond Store</h2>
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
                            max="30000"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className="price-range"
                        />
                    </div>
                </div>
            </div>

            <div className="collection-grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.name}
                        product={product}
                        onClick={handleProductClick}
                    />
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