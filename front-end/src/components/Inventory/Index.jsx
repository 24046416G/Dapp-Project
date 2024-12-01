import React, { useState, useEffect } from 'react';
import Button from '../Common/Button/Index.jsx';
import SearchBar from '../Common/SearchBar/Index.jsx';
import '../../css/inventory.css';
import '../../css/layout.css';
import '../../css/modal.css';

const MakeJewelryModal = ({ isOpen, onClose, selectedDiamonds, onSubmit }) => {
    const [formData, setFormData] = useState({
        jewelryId: '',
        name: '',
        price: '',
        image: null,
        diamonds: null,
        certificateHash: ''
    });
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result);
                    setFormData(prev => ({
                        ...prev,
                        image: reader.result
                    }));
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            diamonds: selectedDiamonds
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Make New Jewelry</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-group">
                            <label>Jewelry ID</label>
                            <input
                                type="text"
                                name="jewelryId"
                                value={formData.jewelryId}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Selected Diamonds</label>
                            <div className="selected-diamonds">
                                {selectedDiamonds.map(id => (
                                    <span key={id} className="diamond-tag">Diamond {id}</span>
                                ))}
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Jewelry Image</label>
                            <div 
                                className={`image-upload-area ${isDragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleImageClick}
                            >
                                {previewUrl ? (
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="image-preview"
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span>Drag and drop an image here or click to select</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>IPFS Certificate Hash</label>
                            <input
                                type="text"
                                name="certificateHash"
                                value={formData.certificateHash}
                                onChange={handleInputChange}
                                placeholder="Enter IPFS hash for the certificate"
                                required
                            />
                        </div>
                    </form>
                    <div className="modal-footer">
                        <Button 
                            type="primary"
                            onClick={handleSubmit}
                        >
                            Create Jewelry
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 30000]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [diamonds, setDiamonds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 获取钻石数据
    useEffect(() => {
        const fetchDiamonds = async () => {
            try {
                // 获取当前用户信息
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    throw new Error('User not found');
                }
                const user = JSON.parse(userStr);

                const response = await fetch('http://localhost:3000/diamonds/all/diamonds');
                if (!response.ok) {
                    throw new Error('Failed to fetch diamonds');
                }

                const data = await response.json();
                console.log('raw data in jewelry inventory page',data);
                console.log('user in jewelry inventory page',user);
                // 筛选状态为 JEWELRY_MAKER 且属于当前用户的钻石
                const filteredDiamonds = data.filter(diamond => 
                    diamond.status === 'JEWELRY' && 
                    diamond.currentOwner?._id === user.id &&
                    !diamond.jewelryId
                );

                console.log('Filtered diamonds:', filteredDiamonds);
                setDiamonds(filteredDiamonds);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching diamonds:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDiamonds();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPriceRange([0, e.target.value]);
    };

    const filterOptions = [
        { value: 'all', label: 'All Diamonds' },
        { value: 'round', label: 'Round Cut' },
        { value: 'princess', label: 'Princess Cut' },
        { value: 'emerald', label: 'Emerald Cut' },
        { value: 'oval', label: 'Oval Cut' },
        { value: 'cushion', label: 'Cushion Cut' }
    ];

    const handleCheckboxChange = (productId) => {
        setSelectedProducts((prevSelectedProducts) => {
            if (prevSelectedProducts.includes(productId)) {
                return prevSelectedProducts.filter((id) => id !== productId);
            } else {
                return [...prevSelectedProducts, productId];
            }
        });
    };

    const handleMakeJewelry = async (formData) => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('User not found');
            }
            const user = JSON.parse(userStr);

            // 确保钻石数组不为空
            if (!formData.diamonds || formData.diamonds.length === 0) {
                throw new Error('Please select at least one diamond');
            }

            // 1. 首先调用区块链服务器的注册接口
            const jewelryData = {
                id: formData.jewelryId,
                name: formData.name,
                price: formData.price,
                diamonds: formData.diamonds,
                timestamp: new Date().toISOString()
            };

            console.log('Preparing jewelry registration data:', {
                jewelryData,
                signature: user.id,
                certificateIpfsHash: formData.certificateHash
            });

            const registerResponse = await fetch('http://localhost:3001/api/diamond/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jewelryData,
                    signature: user.id,
                    certificateIpfsHash: formData.certificateHash
                })
            });

            if (!registerResponse.ok) {
                throw new Error('Failed to register jewelry with blockchain');
            }

            const registerResult = await registerResponse.json();
            console.log('Blockchain registration result:', registerResult);

            // 2. 然后调用后端的珠宝创建接口
            const response = await fetch('http://localhost:3000/jewelries/make', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jewelryId: formData.jewelryId,
                    name: formData.name,
                    price: formData.price,
                    image: formData.image,
                    diamonds: formData.diamonds,
                    authenticityCertificate: registerResult.data.transactionHash,  // 使用返回的 infoHash
                    currentOwner: user.id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create jewelry');
            }

            const result = await response.json();
            console.log('Backend create jewelry response:', result);
            
            alert('Jewelry created successfully!');
            
            // 更新钻石列表，移除已用于制作珠宝的钻石
            setDiamonds(prevDiamonds => 
                prevDiamonds.filter(diamond => !formData.diamonds.includes(diamond._id))
            );
            
            // 清空选中的产品
            setSelectedProducts([]);
            
        } catch (error) {
            console.error('Error creating jewelry:', error);
            alert('Failed to create jewelry: ' + error.message);
        }
    };

    const filteredProducts = diamonds.filter((diamond) =>
        diamond.diamondId.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedFilter === 'all' || diamond.metadata?.cut === selectedFilter) &&
        diamond.price <= priceRange[1]
    );

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container">
            <div className="inventory-header">
                <h2>Diamond Inventory</h2>
            </div>

            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                placeholder="Search diamonds by ID or specifications..."
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
                filterOptions={filterOptions}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
            />

            <div className="inventory-container">
                <div className="inventory-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((diamond) => (
                            <div key={diamond._id} className="inventory-card">
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(diamond._id)}
                                    onChange={() => handleCheckboxChange(diamond._id)}
                                />
                                <h3>Diamond {diamond.diamondId}</h3>
                                <p className="inventory-price">Price: ${diamond.price?.toLocaleString()}</p>
                                <div className="inventory-specs">
                                    <p><strong>Carat:</strong> {diamond.metadata?.carat}</p>
                                    <p><strong>Color:</strong> {diamond.metadata?.color}</p>
                                    <p><strong>Clarity:</strong> {diamond.metadata?.clarity}</p>
                                    <p><strong>Cut:</strong> {diamond.metadata?.cut}</p>
                                    <p><strong>Origin:</strong> {diamond.metadata?.origin}</p>
                                </div>
                                <p className="description">{diamond.description}</p>
                                <span className="inventory-status">{diamond.status}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-diamonds-message">
                            No available diamonds for jewelry making. Diamonds may be already used in jewelry or not in the correct status.
                        </div>
                    )}
                </div>
            </div>
            
            <Button 
                onClick={() => setIsModalOpen(true)} 
                disabled={selectedProducts.length === 0}
                className="inventory-make-button"
            >
                Make Jewelry
            </Button>

            <MakeJewelryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDiamonds={selectedProducts}
                onSubmit={handleMakeJewelry}
            />
        </div>
    );
};

export default Inventory;