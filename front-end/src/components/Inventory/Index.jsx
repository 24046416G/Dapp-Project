import React, { useState } from 'react';
import Button from '../Common/Button/Index.jsx';
import '../../css/inventory.css';

const productsData = [
    { 
        id: 1, 
        name: 'Elegant Solitaire Diamond Ring', 
        price: 5999,
        description: '1.2 Carat Round Brilliant Cut Diamond in 18K White Gold Setting'
    },
    { 
        id: 2, 
        name: 'Sapphire Halo Pendant', 
        price: 3499,
        description: 'Royal Blue Sapphire with Diamond Halo in 18K White Gold'
    },
    { 
        id: 3, 
        name: 'Vintage Diamond Earrings', 
        price: 4299,
        description: 'Art Deco Style Diamond Drop Earrings in Platinum'
    },
    { 
        id: 4, 
        name: 'Three-Stone Diamond Ring', 
        price: 7899,
        description: 'Trilogy Ring with Center 1.5ct Diamond in 18K Yellow Gold'
    },
    { 
        id: 5, 
        name: 'Diamond Tennis Bracelet', 
        price: 8999,
        description: '5.0 Carat Total Weight Diamond Bracelet in 14K White Gold'
    },
    { 
        id: 6, 
        name: 'Emerald Cut Diamond Necklace', 
        price: 6599,
        description: 'Emerald Cut Diamond Solitaire Pendant with 18" Chain'
    },
    { 
        id: 7, 
        name: 'Princess Cut Diamond Ring', 
        price: 4799,
        description: '1.0 Carat Princess Cut Diamond with Channel Set Band'
    },
    { 
        id: 8, 
        name: 'Diamond Eternity Band', 
        price: 3299,
        description: 'Full Eternity Ring with Round Brilliant Diamonds'
    },
    { 
        id: 9, 
        name: 'Oval Diamond Engagement Ring', 
        price: 9299,
        description: '2.0 Carat Oval Diamond with Pave Diamond Band'
    },
    { 
        id: 10, 
        name: 'Diamond Cluster Earrings', 
        price: 2899,
        description: 'Flower Design Diamond Cluster Studs in 14K White Gold'
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
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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
        // 这里添加创建珠宝的逻辑
        alert('Jewelry created successfully!');
    };

    const filteredProducts = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Diamond Inventory</h2>
            <input
                type="text"
                placeholder="Search diamonds..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-bar"
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
                            <p>Price: ${product.price}</p>
                            <p className="description">{product.description}</p>
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