import React, { useState } from 'react';
import '../../css/inventory.css';

const productsData = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 },
  { id: 4, name: 'Product 4', price: 40 },
  { id: 5, name: 'Product 5', price: 50 },
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
            <button onClick={handleButtonClick} className="make-jewelry-button">
                Check Selected Diamonds
            </button>
        </div>
    );
};

export default Inventory;