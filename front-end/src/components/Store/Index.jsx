import React, { useState, useEffect } from 'react';
import ProductDetailModal from '../Common/ProductDetailModal/Index.jsx';
import ProductCard from '../Common/ProductCard/Index.jsx';
import SearchBar from '../Common/SearchBar/Index.jsx';
import { USER_TYPES } from '../../constants/userTypes';
import '../../css/layout.css';
import '../../css/filter.css';
import '../../css/productCard.css';
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
                switch(userType) {
                    case USER_TYPES.JEWELRY_MAKER:
                    case USER_TYPES.GRADING_LAB:
                    case USER_TYPES.CUTTING_COMPANY:
                        endpoint = 'http://localhost:3000/diamonds/all/diamonds';
                        break;
                    case USER_TYPES.CUSTOMER:
                        endpoint = 'http://localhost:3000/jewelries/all';
                        break;
                    default:
                        endpoint = '';
                        break;
                }

                if (!endpoint) {
                    throw new Error('Invalid user type');
                }

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
                        history: diamond.history,
                        status: diamond.status
                    }));
                    console.log('formattedData 1',formattedData);
                    setProducts(formattedData);
                } else {
                    const jewelriesArray = Array.isArray(data) ? data : data.jewelries || [];
                    console.log('jewelriesArray',jewelriesArray);
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

    const renderHeader = () => {
        switch(userType) {
            case USER_TYPES.CUSTOMER:
                return {
                    title: "Jewelry Market",
                    description: "Find your perfect diamond jewelry",
                    searchPlaceholder: "Search by jewelry name or ID..."
                };
            case USER_TYPES.JEWELRY_MAKER:
                return {
                    title: "Diamond Market",
                    description: "Purchase graded diamonds for jewelry making",
                    searchPlaceholder: "Search diamonds by ID or specifications..."
                };
            case USER_TYPES.GRADING_LAB:
                return {
                    title: "Cut Diamond Market",
                    description: "Find cut diamonds ready for grading",
                    searchPlaceholder: "Search by diamond ID or cut type..."
                };
            case USER_TYPES.CUTTING_COMPANY:
                return {
                    title: "Raw Diamond Market",
                    description: "Purchase raw diamonds for cutting",
                    searchPlaceholder: "Search by diamond ID or origin..."
                };
            default:
                return {
                    title: "Diamond Store",
                    description: "Browse available diamonds",
                    searchPlaceholder: "Search products..."
                };
        }
    };

    const getFilterOptions = () => {
        switch(userType) {
            case USER_TYPES.CUSTOMER:
                return [
                    { value: 'all', label: 'All Jewelry' },
                    { value: 'rings', label: 'Rings' },
                    { value: 'necklaces', label: 'Necklaces' },
                    { value: 'earrings', label: 'Earrings' },
                    { value: 'bracelets', label: 'Bracelets' }
                ];
            case USER_TYPES.JEWELRY_MAKER:
                return [
                    { value: 'all', label: 'All Diamonds' },
                    { value: 'round', label: 'Round Cut' },
                    { value: 'princess', label: 'Princess Cut' },
                    { value: 'emerald', label: 'Emerald Cut' },
                    { value: 'oval', label: 'Oval Cut' }
                ];
            case USER_TYPES.GRADING_LAB:
                return [
                    { value: 'all', label: 'All Cut Types' },
                    { value: 'excellent', label: 'Excellent Cut' },
                    { value: 'very_good', label: 'Very Good Cut' },
                    { value: 'good', label: 'Good Cut' }
                ];
            case USER_TYPES.CUTTING_COMPANY:
                return [
                    { value: 'all', label: 'All Origins' },
                    { value: 'africa', label: 'Africa' },
                    { value: 'russia', label: 'Russia' },
                    { value: 'australia', label: 'Australia' }
                ];
            default:
                return [];
        }
    };

    const filterProducts = (products) => {
        switch(userType) {
            case USER_TYPES.JEWELRY_MAKER:
                return products.filter(product => 
                    product.status === 'GRADED' &&
                    product.price <= priceRange[1] &&
                    (selectedFilter === 'all' || product.metadata?.cut === selectedFilter)
                );
            case USER_TYPES.GRADING_LAB:
                return products.filter(product => 
                    product.status === 'CUT' &&
                    product.price <= priceRange[1] &&
                    (selectedFilter === 'all' || product.metadata?.cutQuality === selectedFilter)
                );
            case USER_TYPES.CUTTING_COMPANY:
                return products.filter(product => 
                    product.status === 'MINED' &&
                    product.price <= priceRange[1] &&
                    (selectedFilter === 'all' || product.metadata?.origin === selectedFilter)
                );
            case USER_TYPES.CUSTOMER:
                return products.filter(product => 
                    product.price <= priceRange[1] &&
                    (selectedFilter === 'all' || product.type === selectedFilter)
                );
            default:
                return products;
        }
    };

    const handlePurchaseSuccess = (updatedProduct) => {
        setProducts(prevProducts => 
            prevProducts.filter(product => product._id !== updatedProduct._id)
        );
    };

    const { title, description, searchPlaceholder } = renderHeader();
    const filterOptions = getFilterOptions();
    const filteredProducts = filterProducts(products);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <div className="store-header">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
            
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder={searchPlaceholder}
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
            />

            <div className="data-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="data-grid-item">
                        <ProductCard
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
                    onPurchaseSuccess={handlePurchaseSuccess}
                />
            )}
        </div>
    );
};

export default Store; 