import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import ProductCard from '../Common/ProductCard/Index.jsx';
import ProductDetailModal from '../Common/ProductDetailModal/Index.jsx';
import '../../css/layout.css';
import '../../css/search.css';
import '../../css/filter.css';
import '../../css/card.css';
import '../../css/collection.css';

const Collection = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('purchaseDate');
    const [filterBy, setFilterBy] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState('');
    const [collectionData, setCollectionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserJewelries = async () => {
            try {
                // 从 localStorage 获取用户信息
                const savedUser = localStorage.getItem('user');
                if (!savedUser) {
                    throw new Error('User not found');
                }

                const user = JSON.parse(savedUser);
                const response = await fetch(`http://localhost:3000/jewelries/user/${user.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch jewelries');
                }

                const data = await response.json();
                console.log(data);
                setCollectionData(data.jewelries);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user jewelries:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserJewelries();
    }, []);

    useEffect(() => {
        const getAddress = async () => {
            if (window.ethereum) {
                try {
                    const provider = new BrowserProvider(window.ethereum);
                    const accounts = await provider.send("eth_requestAccounts", []);
                    setCurrentAddress(accounts[0]);
                } catch (error) {
                    console.error('Error getting address:', error);
                }
            }
        };

        getAddress();

        // 监听账户变
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setCurrentAddress(accounts[0] || '');
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', () => {});
            }
        };
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterBy(event.target.value);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

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
        <div className="container">
            <div className="collection-header">
                <div className="header-content">
                    <div>
                        <h2>My Diamond Collection</h2>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-label">Current Address</span>
                            <span className="stat-value">
                                {currentAddress ? 
                                    `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}` : 
                                    'Not Connected'
                                }
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

            <div className="data-grid">
                {filteredAndSortedItems.map((item) => (
                    <div className="data-grid-item" key={item.id}>
                        <ProductCard
                            product={item}
                            onClick={handleItemClick}
                        />
                    </div>
                ))}
            </div>

            {selectedItem && (
                <ProductDetailModal
                    product={selectedItem}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Collection; 