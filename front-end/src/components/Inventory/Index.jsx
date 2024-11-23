import React, { useState } from 'react';
import '../../css/inventory.css';

const productsData = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
    { id: 3, name: 'Product 3', price: 30 },
    { id: 4, name: 'Product 4', price: 40 },
    { id: 5, name: 'Product 5', price: 50 },
    { id: 6, name: 'Product 6', price: 60 },
    { id: 7, name: 'Product 7', price: 70 },
    { id: 8, name: 'Product 8', price: 80 },
    { id: 9, name: 'Product 9', price: 90 },
    { id: 10, name: 'Product 10', price: 100 },
    { id: 11, name: 'Product 11', price: 10 },
    { id: 12, name: 'Product 12', price: 20 },
    { id: 13, name: 'Product 13', price: 30 },
    { id: 14, name: 'Product 14', price: 40 },
    { id: 15, name: 'Product 15', price: 50 },
    { id: 16, name: 'Product 16', price: 60 },
    { id: 17, name: 'Product 17', price: 70 },
    { id: 18, name: 'Product 18', price: 80 },
    { id: 19, name: 'Product 19', price: 90 },
    { id: 20, name: 'Product 20', price: 100 },
];

const Inventory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

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

    const handleButtonClick = () => {
        alert(`Selected products: ${selectedProducts.join(', ')}`);
    };

    const filteredProducts = productsData.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Inventory</h2>
            <input
                type="text"
                placeholder="Search products..."
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
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleButtonClick} className="make-jewelry-button">
                Check Selected Diamonds
            </button>
        </div>
    );
};

export default Inventory;