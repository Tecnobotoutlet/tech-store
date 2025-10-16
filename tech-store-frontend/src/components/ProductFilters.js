import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Star, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useCategories } from '../context/CategoryContext';

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
  // 🔥 NUEVO: Estados para filtros colapsables
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceInputs, setPriceInputs] = useState({
    min: priceRange.min,
    max: priceRange.max
  });

  const { categories, loading: loadingCategories } = useCategories();

  const categoryList = useMemo(() => {
    const list = [];
    Object.values(categories).forEach(category => {
      list.push({
        name: category.name,
        icon: category.icon,
        type: 'main'
      });
      
      if (category.subcategories) {
        Object.values(category.subcategories).forEach(subcat => {
          list.push({
            name: subcat.name,
            parent: category.name,
            type: 'sub'
          });
        });
      }
    });
    return list;
  }, [categories]);

  const featuredCategories = useMemo(() => {
    return Object.values(categories).slice(0, 3).map(cat => ({
      name: cat.name,
      icon: cat.icon
    }));
  }, [categories]);
  
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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* 🔥 BARRA COMPACTA SIEMPRE VISIBLE */}
      <div className="space-y-4">
        {/* Búsqueda + Ordenar (siempre visible) */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar productos, marcas, especificaciones..."
              value={searchTerm || ''}
              onChange={(e) => {
                console.log('Búsqueda cambiada:', e.target.value);
                onSearchChange(e.target.value);
              }}
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Ordenar */}
          <div className="md:w-64">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium transition-all appearance-none bg-white cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Filtros Avanzados */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              showAdvancedFilters || activeFiltersCount > 0
                ? 'bg-gradient-mixxo text-white shadow-mixxo'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-mixxo-pink-500 px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
            {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* 🔥 FILTROS AVANZADOS - COLAPSABLES */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-gray-200 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-mixxo-pink-500" />
                Filtros Avanzados
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpiar todo
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categorías */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  📁 Categorías
                  {loadingCategories && (
                    <span className="text-xs text-gray-500 ml-2 font-normal">(Cargando...)</span>
                  )}
                </label>
                <div 
                  className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-gray-50 category-scroll-container"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E0 #F7FAFC'
                  }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {categoryList.length === 0 && !loadingCategories ? (
                    <p className="text-sm text-gray-500">No hay categorías</p>
                  ) : (
                    categoryList.map((category, index) => (
                      <label 
                        key={`${category.name}-${index}`} 
                        className={`flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors ${
                          category.type === 'sub' ? 'ml-4' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onCategoryChange([...selectedCategories, category.name]);
                            } else {
                              onCategoryChange(selectedCategories.filter(c => c !== category.name));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 flex-1">
                          {category.icon && <span className="mr-1">{category.icon}</span>}
                          {category.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {categoryList.length > 6 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    ↕️ Desliza para ver más
                  </p>
                )}
              </div>

              {/* Rango de Precio */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  💰 Rango de Precio
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Precio mínimo"
                    value={priceInputs.min || ''}
                    onChange={(e) => handlePriceInputChange('min', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Precio máximo"
                    value={priceInputs.max || ''}
                    onChange={(e) => handlePriceInputChange('max', e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={applyPriceFilter}
                    className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    Aplicar
                  </button>
                </div>
                {(priceRange.min > 0 || priceRange.max < 10000000) && (
                  <div className="text-xs text-gray-600 mt-2 font-medium">
                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                  </div>
                )}
              </div>

              {/* Calificación */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  ⭐ Calificación
                </label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
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
                  <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === 0}
                      onChange={() => onRatingChange(0)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 font-medium">Todas</span>
                  </label>
                </div>
              </div>

              {/* Filtros Rápidos */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  ⚡ Filtros Rápidos
                </label>
                <div className="space-y-2">
                  {/* Disponibilidad */}
                  <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors border-2 border-gray-200">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => onStockFilterChange(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">✅ Solo en stock</span>
                  </label>

                  {/* Categorías destacadas */}
                  {featuredCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => onCategoryChange([category.name])}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gradient-mixxo hover:text-white rounded-lg transition-all font-medium"
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}

                  {/* Precio rápido */}
                  <button
                    onClick={() => {
                      onPriceRangeChange({ min: 0, max: 1000000 });
                      setPriceInputs({ min: 0, max: 1000000 });
                    }}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gradient-mixxo hover:text-white rounded-lg transition-all font-medium"
                  >
                    💰 Menos de $1M
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 RESUMEN DE FILTROS ACTIVOS */}
        {activeFiltersCount > 0 && !showAdvancedFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                🔍 "{searchTerm}"
                <button onClick={() => onSearchChange('')} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedCategories.map((cat, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                📁 {cat}
                <button onClick={() => onCategoryChange(selectedCategories.filter(c => c !== cat))} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(priceRange.min > 0 || priceRange.max < 10000000) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                💰 {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                <button onClick={() => {
                  onPriceRangeChange({ min: 0, max: 10000000 });
                  setPriceInputs({ min: 0, max: 0 });
                }} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                ⭐ {minRating}+ estrellas
                <button onClick={() => onRatingChange(0)} className="hover:text-yellow-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {showOnlyInStock && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✅ En stock
                <button onClick={() => onStockFilterChange(false)} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Estilos */}
      <style jsx>{`
        .category-scroll-container::-webkit-scrollbar {
          width: 6px;
        }
        
        .category-scroll-container::-webkit-scrollbar-track {
          background: #F7FAFC;
          border-radius: 4px;
        }
        
        .category-scroll-container::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 4px;
        }
        
        .category-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductFilters;
