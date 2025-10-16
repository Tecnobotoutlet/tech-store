// src/components/ProductResults.js - Versión mixxo moderna
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Grid, List, Sparkles, AlertCircle } from 'lucide-react';

const ProductResults = ({ 
  products, 
  filterStats, 
  searchTerm, 
  selectedCategories,
  onProductClick 
}) => {
  const [viewMode, setViewMode] = useState('grid');
  
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

  // Resto del código... (el if de productos === 0 se mantiene igual)
  
  if (!products || products.length === 0) {
    // ... tu código actual ...
  }

  return (
    <div>
      {/* Header de resultados - MODIFICADO */}
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
            {/* 🔥 MOSTRAR PROGRESO */}
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

      {/* Stats de filtros activos - SE MANTIENE IGUAL */}
      {/* ... tu código actual ... */}

      {/* Grid de productos - MODIFICADO */}
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
        // Vista de lista - MODIFICADO
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
                {/* ... tu código actual de la vista lista ... */}
              </div>
            );
          })}
        </div>
      )}

      {/* 🔥 LOADING INDICATOR */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-mixxo-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Cargando más productos...
            </p>
          </div>
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
            className="btn-mixxo"
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
