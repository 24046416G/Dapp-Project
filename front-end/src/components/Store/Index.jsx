import React, { useState, useEffect } from 'react';
import ProductDetailModal from '../Common/ProductDetailModal/Index.jsx';
import ProductCard from '../Common/ProductCard/Index.jsx';
import { USER_TYPES } from '../../constants/userTypes';
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                let endpoint;
                console.log('userType',userType);
                if (userType === USER_TYPES.JEWELRY_MAKER || userType === USER_TYPES.GRADING_LAB || userType === USER_TYPES.CUTTING_COMPANY) {
                    endpoint = 'http://localhost:3000/diamonds/all/diamonds';
                } else if (userType === USER_TYPES.CUSTOMER) {
                    endpoint = 'http://localhost:3000/jewelries/all';
                } else {
                    endpoint = '';
                }
                console.log('endpoint',endpoint);
                const response = await fetch(endpoint);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log('data',data);
                console.log('userType',userType);
                if (userType === USER_TYPES.JEWELRY_MAKER || userType === USER_TYPES.GRADING_LAB || userType === USER_TYPES.CUTTING_COMPANY) {
                    const formattedData = data.map(diamond => ({
                        id: diamond._id,
                        name: `Diamond ${diamond.diamondId}`,
                        price: diamond.price || 0,
                        description: `${diamond.metadata.carat} Carat Diamond`,
                        image: diamond.metadata.images,
                        diamonds: [{
                            diamondId: diamond.diamondId,
                            metadata: diamond.metadata,
                            certificates: diamond.certificates
                        }],
                        currentOwner: diamond.currentOwner,
                        history: diamond.history
                    }));
                    console.log('formattedData 1',formattedData);
                    setProducts(formattedData);
                } else {
                    const jewelriesArray = Array.isArray(data) ? data : data.jewelries || [];
                    setProducts(jewelriesArray);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchData();
    }, [userType]);

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

    const filteredProducts = products.filter((product) => {
        const matchesPrice = product.price <= priceRange[1];
        // const matchesHistory = product.history.length <= 3;
        // return matchesPrice && matchesHistory;
        return matchesPrice;
    });

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
                <h2>
                    {userType === USER_TYPES.CUSTOMER ? 'Jewelry Market' : 
                     userType === USER_TYPES.JEWELRY_MAKER || userType === USER_TYPES.GRADING_LAB || userType === USER_TYPES.CUTTING_COMPANY ? 'Diamond Market' : 
                     'Store'}
                </h2>
                <p>
                    {userType === USER_TYPES.CUSTOMER ? 'Find your perfect diamond jewelry' : 
                     userType === USER_TYPES.JEWELRY_MAKER ? 'Choose your favorite diamonds' : 
                     'description'}
                </p>
            </div>
            
            <div className="store-filters">
                <input
                    type="text"
                    placeholder={userType === USER_TYPES.CUSTOMER ? 
                        "Search by diamond ID or carat..." : 
                        userType === USER_TYPES.JEWELRY_MAKER ? 
                        "Search inventory..." : 
                        "Search products..."}
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

                    {userType !== USER_TYPES.COMPANY && (
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
                    )}
                </div>
            </div>

            <div className="data-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="data-grid-item">
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={handleProductClick}
                            userType={userType}
                        />
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    userType={userType}
                    showBuyButton={true}
                />
            )}
        </div>
    );
};

export default Store; 