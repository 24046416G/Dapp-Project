import React from 'react';
import '../../../css/searchBar.css';

const SearchBar = ({ 
    searchTerm, 
    onSearchChange, 
    placeholder,
    selectedFilter,
    onFilterChange,
    filterOptions,
    priceRange,
    onPriceChange,
    showPriceFilter = true
}) => {
    return (
        <div className="search-filters">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={onSearchChange}
                className="search-bar"
            />
            
            <div className="filter-controls">
                {filterOptions && (
                    <select 
                        value={selectedFilter} 
                        onChange={onFilterChange}
                        className="filter-select"
                    >
                        {filterOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
                
                {showPriceFilter && (
                    <div className="price-filter">
                        <span>Max Price: ${priceRange[1]}</span>
                        <input
                            type="range"
                            min="0"
                            max="30000"
                            value={priceRange[1]}
                            onChange={onPriceChange}
                            className="price-range"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar; 