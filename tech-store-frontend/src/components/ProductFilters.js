import React, { useState } from 'react';
import { Search, Filter, X, Star, ChevronDown, ChevronUp } from 'lucide-react';

const ProductFilters = ({ 
  products, 
  onFilterChange, 
  searchTerm, 
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  sortBy,
  onSortChange,
  showOnlyInStock,
  onStockFilterChange
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [priceInputs, setPriceInputs] = useState({
    min: priceRange.min,
    max: priceRange.max
  });

  // Obtener categorías únicas de los productos
  const categories = [...new Set(products.map(product => product.category))];
  
  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'featured', label: 'Destacados' },
    { value: 'price-low-high', label: 'Precio: Menor a Mayor' },
    { value: 'price-high-low', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Calificados' },
    { value: 'newest', label: 'Más Nuevos' },
    { value: 'name', label: 'Nombre A-Z' }
  ];

  const handlePriceInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setPriceInputs(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const applyPriceFilter = () => {
    onPriceRangeChange({
      min: priceInputs.min,
      max: priceInputs.max || 10000000
    });
  };

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange([]);
    onPriceRangeChange({ min: 0, max: 10000000 });
    onRatingChange(0);
    onStockFilterChange(false);
    setPriceInputs({ min: 0, max: 0 });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange.min > 0 || priceRange.max < 10000000) count++;
    if (minRating > 0) count++;
    if (showOnlyInStock) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <h2 className="text-xl font-semibold text-gray-800">Filtrar Productos</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          )}
          
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="lg:hidden flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            {isFiltersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar productos por nombre, marca, especificaciones..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 ${
        isFiltersOpen || window.innerWidth >= 1024 ? 'block' : 'hidden lg:grid'
      }`}>
        
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categorías
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onCategoryChange([...selectedCategories, category]);
                    } else {
                      onCategoryChange(selectedCategories.filter(c => c !== category));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Precio
          </label>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Precio mínimo"
              value={priceInputs.min || ''}
              onChange={(e) => handlePriceInputChange('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="number"
              placeholder="Precio máximo"
              value={priceInputs.max || ''}
              onChange={(e) => handlePriceInputChange('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={applyPriceFilter}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Aplicar
            </button>
          </div>
          {(priceRange.min > 0 || priceRange.max < 10000000) && (
            <div className="text-xs text-gray-600 mt-2">
              {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación Mínima
          </label>
          <div className="space-y-2">
            {[4, 3, 2, 1].map(rating => (
              <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => onRatingChange(rating)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {renderStars(rating)}
                  </div>
                  <span className="text-sm text-gray-600">y más</span>
                </div>
              </label>
            ))}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === 0}
                onChange={() => onRatingChange(0)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Todas</span>
            </label>
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidad
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={(e) => onStockFilterChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Solo en stock</span>
          </label>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtros Rápidos
          </label>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(['Gaming'])}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              🎮 Gaming
            </button>
            <button
              onClick={() => onCategoryChange(['Smartphones'])}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              📱 Smartphones
            </button>
            <button
              onClick={() => {
                onPriceRangeChange({ min: 0, max: 1000000 });
                setPriceInputs({ min: 0, max: 1000000 });
              }}
              className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              💰 Menos de $1M
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;