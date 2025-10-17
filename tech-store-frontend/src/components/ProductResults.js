// src/components/ProductResults.js - Versión mixxo moderna con Scroll Infinito
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import LoadingMixxo from './LoadingMixxo';
import { Grid, List, Sparkles, AlertCircle } from 'lucide-react';

const ProductResults = ({ 
  products, 
  filterStats, 
  searchTerm, 
  selectedCategories,
  onProductClick 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  
  // 🔥 ESTADOS PARA SCROLL INFINITO
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const PRODUCTS_PER_PAGE = 20;
  const observerRef = useRef();
  const lastProductRef = useRef();

  // 🔥 RESETEAR CUANDO CAMBIAN LOS FILTROS
  useEffect(() => {
    setPage(1);
    setDisplayedProducts(products.slice(0, PRODUCTS_PER_PAGE));
    setHasMore(products.length > PRODUCTS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [products, searchTerm, selectedCategories]);

  // 🔥 CARGAR MÁS PRODUCTOS
  const loadMoreProducts = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    
    setTimeout(() => {
      const startIndex = page * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      const newProducts = products.slice(startIndex, endIndex);
      
      if (newProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < products.length);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 300);
  }, [products, page, loading, hasMore]);

  // 🔥 INTERSECTION OBSERVER
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreProducts();
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    );

    if (lastProductRef.current) {
      observer.observe(lastProductRef.current);
    }

    return () => {
      if (lastProductRef.current) {
        observer.unobserve(lastProductRef.current);
      }
    };
  }, [loading, hasMore, loadMoreProducts]);

  if (!products || products.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-mixxo rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No encontramos productos
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : 'Intenta ajustar tus filtros de búsqueda'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-mixxo"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header de resultados */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {searchTerm ? (
              <>Resultados para <span className="text-gradient-mixxo">"{searchTerm}"</span></>
            ) : selectedCategories.length > 0 ? (
              <>Categoría: <span className="text-gradient-mixxo">{selectedCategories.join(', ')}</span></>
            ) : (
              <>Todos los <span className="text-gradient-mixxo">Productos</span></>
            )}
          </h2>
          <p className="text-gray-600 font-medium">
            Mostrando {displayedProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Controles de vista */}
        <div className="flex items-center gap-3">
          {/* 🔥 BARRA DE PROGRESO */}
          {displayedProducts.length < products.length && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mr-4">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-mixxo transition-all duration-300"
                  style={{ 
                    width: `${(displayedProducts.length / products.length) * 100}%` 
                  }}
                />
              </div>
              <span className="font-medium">
                {Math.round((displayedProducts.length / products.length) * 100)}%
              </span>
            </div>
          )}
          
          <div className="glass-card rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-mixxo text-white shadow-mixxo'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vista en cuadrícula"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-mixxo text-white shadow-mixxo'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vista en lista"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats de filtros activos */}
      {(searchTerm || selectedCategories.length > 0) && (
        <div className="mb-6 flex flex-wrap gap-3">
          {searchTerm && (
            <div className="glass-mixxo px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Búsqueda:</span>
              <span className="text-sm font-bold text-mixxo-pink-500">{searchTerm}</span>
            </div>
          )}
          {selectedCategories.map((category, index) => (
            <div key={index} className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Categoría:</span>
              <span className="text-sm font-bold text-mixxo-cyan-500">{category}</span>
            </div>
          ))}
        </div>
      )}

      {/* Grid de productos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
          {displayedProducts.map((product, index) => {
            const isLastProduct = index === displayedProducts.length - 1;
            
            return (
              <div
                key={product.id}
                ref={isLastProduct ? lastProductRef : null}
                className="animate-slide-up"
                style={{ animationDelay: `${(index % PRODUCTS_PER_PAGE) * 0.05}s` }}
              >
                <ProductCard 
                  product={product} 
                  onProductClick={onProductClick}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {displayedProducts.map((product, index) => {
            const isLastProduct = index === displayedProducts.length - 1;
            
            return (
              <div
                key={product.id}
                ref={isLastProduct ? lastProductRef : null}
                onClick={() => onProductClick && onProductClick(product.id, product.slug)}
                className="glass-card rounded-2xl p-6 hover:shadow-mixxo-lg transition-all duration-300 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${(index % PRODUCTS_PER_PAGE) * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs font-bold text-mixxo-pink-500 bg-mixxo-pink-50 px-3 py-1 rounded-full">
                          {product.categoryName || product.category}
                        </span>
                        {product.isNew && (
                          <span className="ml-2 badge-new">
                            <Sparkles className="w-3 h-3" />
                            NUEVO
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 font-semibold">{product.brand}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gradient-mixxo transition-all">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description || 'Sin descripción disponible'}
                    </p>

                    {product.specifications && product.specifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.specifications.slice(0, 4).map((spec, idx) => (
                          <div key={idx} className="glass-mixxo px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                            {spec.label}: {spec.value}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 4)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm font-bold text-gray-900">
                            {product.rating || 4}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({product.reviews || 0} reseñas)
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gradient-mixxo">
                            {new Intl.NumberFormat('es-CO', {
                              style: 'currency',
                              currency: 'COP',
                              minimumFractionDigits: 0
                            }).format(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              {new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                              }).format(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="btn-mixxo"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Agregar' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔥 LOADING INDICATOR */}
      {loading && (
        <div className="py-12">
          <LoadingMixxo 
            size="lg" 
            message="Cargando más productos..." 
          />
        </div>
      )}

      {/* 🔥 MENSAJE DE COMPLETADO */}
      {!hasMore && displayedProducts.length > PRODUCTS_PER_PAGE && (
        <div className="text-center mt-12 py-8 glass-card rounded-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¡Has visto todos los productos!
          </h3>
          <p className="text-gray-600 mb-6">
            Mostrando {displayedProducts.length} de {products.length} productos
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-outline-mixxo"
          >
            ↑ Volver arriba
          </button>
        </div>
      )}

      {/* 🔥 BOTÓN ALTERNATIVO PARA CARGAR MÁS */}
      {!loading && hasMore && displayedProducts.length >= PRODUCTS_PER_PAGE && (
        <div className="text-center mt-12 py-8">
          <button
            onClick={loadMoreProducts}
            className="btn-mixxo text-lg px-8 py-4"
          >
            Cargar Más Productos ↓
          </button>
          <p className="text-sm text-gray-500 mt-3">
            o sigue bajando para cargar automáticamente
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductResults;
