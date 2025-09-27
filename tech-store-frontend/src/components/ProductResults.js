import React, { useState } from 'react';
import { Grid, List, Package, TrendingUp, Clock, Star } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductResults = ({ 
  products, 
  filterStats, 
  searchTerm, 
  selectedCategories,
  isLoading = false,
  onProductClick 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Calcular productos para la página actual
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Generar páginas para la paginación
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getFilterSummary = () => {
    const parts = [];
    
    if (searchTerm) {
      parts.push(`"${searchTerm}"`);
    }
    
    if (selectedCategories.length > 0) {
      if (selectedCategories.length === 1) {
        parts.push(`en ${selectedCategories[0]}`);
      } else {
        parts.push(`en ${selectedCategories.length} categorías`);
      }
    }
    
    return parts.length > 0 ? parts.join(' ') : 'todos los productos';
  };

  // Componente para vista de lista
  const ProductListItem = ({ product }) => (
    <div 
      onClick={() => onProductClick && onProductClick(product.id)}
      className="bg-white rounded-lg shadow-md p-4 flex space-x-4 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-blue-600 font-medium">{product.category}</p>
            
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            <div className={`text-sm font-medium mt-1 ${
              product.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock ? '✅ En stock' : '❌ Agotado'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header de resultados */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Resultados de búsqueda
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Package className="w-4 h-4" />
                <span>
                  {products.length} de {filterStats.total} productos {getFilterSummary()}
                </span>
              </span>
              
              {filterStats.price && (
                <span className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    Desde {formatPrice(filterStats.price.min)} hasta {formatPrice(filterStats.price.max)}
                  </span>
                </span>
              )}
            </div>
          </div>
          
          {/* Controles de vista */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Vista:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {products.filter(p => p.isNew).length}
              </div>
              <div className="text-sm text-gray-600">Productos nuevos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.inStock).length}
              </div>
              <div className="text-sm text-gray-600">En stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.rating >= 4.5).length}
              </div>
              <div className="text-sm text-gray-600">Mejor calificados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => p.discount > 0).length}
              </div>
              <div className="text-sm text-gray-600">Con descuento</div>
            </div>
          </div>
        )}
      </div>

      {/* Resultados */}
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-500 mb-6">
            Intenta ajustar tus filtros o buscar algo diferente
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-400">Sugerencias:</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Gaming
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Smartphones
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Laptops
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Grid de productos */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onProductClick={onProductClick}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {currentProducts.map(product => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, products.length)} de {products.length} productos
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {getPageNumbers().map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        currentPage === page
                          ? 'text-blue-600 bg-blue-50 border border-blue-300'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductResults;