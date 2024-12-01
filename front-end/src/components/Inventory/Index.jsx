import React, { useState } from 'react';
import Button from '../Common/Button/Index.jsx';
import SearchBar from '../Common/SearchBar/Index.jsx';
import '../../css/inventory.css';
import '../../css/layout.css';

const productsData = [
    { 
        id: 1, 
        name: 'Round Brilliant Diamond', 
        price: 12999,
        description: '2.1 Carat D Color VVS1 Clarity Excellent Cut',
        status: 'GRADED',
        metadata: {
            carat: 2.1,
            color: 'D',
            clarity: 'VVS1',
            cut: 'Excellent',
            polish: 'Excellent',
            symmetry: 'Excellent',
            origin: 'South Africa'
        }
    },
    { 
        id: 2, 
        name: 'Oval Cut Diamond', 
        price: 15499,
        description: '2.5 Carat E Color VS1 Clarity',
        status: 'GRADED',
        metadata: {
            carat: 2.5,
            color: 'E',
            clarity: 'VS1',
            cut: 'Very Good',
            polish: 'Excellent',
            symmetry: 'Very Good',
            origin: 'Botswana'
        }
    },
    { 
        id: 3, 
        name: 'Princess Cut Diamond', 
        price: 8999,
        description: '1.5 Carat F Color VS2 Clarity',
        status: 'GRADED',
        metadata: {
            carat: 1.5,
            color: 'F',
            clarity: 'VS2',
            cut: 'Excellent',
            polish: 'Very Good',
            symmetry: 'Excellent',
            origin: 'Canada'
        }
    },
    { 
        id: 4, 
        name: 'Emerald Cut Diamond', 
        price: 18999,
        description: '3.0 Carat G Color VVS2 Clarity',
        status: 'GRADED',
        metadata: {
            carat: 3.0,
            color: 'G',
            clarity: 'VVS2',
            cut: 'Excellent',
            polish: 'Excellent',
            symmetry: 'Excellent',
            origin: 'Russia'
        }
    },
    { 
        id: 5, 
        name: 'Cushion Cut Diamond', 
        price: 11499,
        description: '2.0 Carat D Color VS1 Clarity',
        status: 'GRADED',
        metadata: {
            carat: 2.0,
            color: 'D',
            clarity: 'VS1',
            cut: 'Very Good',
            polish: 'Excellent',
            symmetry: 'Very Good',
            origin: 'Australia'
        }
    }
];

const MakeJewelryModal = ({ isOpen, onClose, selectedDiamonds, onSubmit }) => {
    const [formData, setFormData] = useState({
        jewelryId: '',
        name: '',
        type: 'ring',
        material: '18k_white_gold',
        price: '',
        description: '',
        image: null
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
                            <label>Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="ring">Ring</option>
                                <option value="necklace">Necklace</option>
                                <option value="earrings">Earrings</option>
                                <option value="bracelet">Bracelet</option>
                                <option value="pendant">Pendant</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Material</label>
                            <select
                                name="material"
                                value={formData.material}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="18k_white_gold">18K White Gold</option>
                                <option value="18k_yellow_gold">18K Yellow Gold</option>
                                <option value="18k_rose_gold">18K Rose Gold</option>
                                <option value="platinum">Platinum</option>
                            </select>
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
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
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
                        <div className="modal-footer">
                            <Button 
                                type="primary"
                                onClick={handleSubmit}
                            >
                                Create Jewelry
                            </Button>
                        </div>
                    </form>
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

    const handleMakeJewelry = (formData) => {
        console.log('Making jewelry with:', formData);
        alert('Jewelry created successfully!');
    };

    const filteredProducts = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedFilter === 'all' || product.metadata?.cut === selectedFilter) &&
        product.price <= priceRange[1]
    );

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

            <div className="products-container">
                <div className="products">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => handleCheckboxChange(product.id)}
                            />
                            <h3>{product.name}</h3>
                            <p className="price">Price: ${product.price.toLocaleString()}</p>
                            <div className="diamond-specs">
                                <p><strong>Carat:</strong> {product.metadata.carat}</p>
                                <p><strong>Color:</strong> {product.metadata.color}</p>
                                <p><strong>Clarity:</strong> {product.metadata.clarity}</p>
                                <p><strong>Cut:</strong> {product.metadata.cut}</p>
                                <p><strong>Origin:</strong> {product.metadata.origin}</p>
                            </div>
                            <p className="description">{product.description}</p>
                            <span className="status-badge">{product.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <Button 
                onClick={() => setIsModalOpen(true)} 
                className="make-jewelry-button"
                disabled={selectedProducts.length === 0}
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