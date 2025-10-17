// src/components/ProductCarousel.js
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCarousel = ({ products, onProductClick, autoPlaySpeed = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [randomProducts, setRandomProducts] = useState([]);
  const autoPlayRef = useRef(null);
  const { addToCart } = useCart();

  // Obtener productos aleatorios al montar
  useEffect(() => {
    if (products && products.length > 0) {
      // Filtrar productos con imágenes y stock disponible
      const availableProducts = products.filter(p => p.image && p.inStock);
      
      // Mezclar y tomar 12 productos aleatorios
      const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 12);
      
      setRandomProducts(selected);
    }
  }, [products]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && randomProducts.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === randomProducts.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlaySpeed);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, randomProducts.length, autoPlaySpeed]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? randomProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === randomProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleProductClick = (productId) => {
    if (onProductClick) {
      onProductClick(productId);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!randomProducts || randomProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner-mixxo"></div>
      </div>
    );
  }

  // Calcular productos visibles (mostrar 4 en desktop, 2 en tablet, 1 en móvil)
  const getVisibleProducts = () => {
    const result = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % randomProducts.length;
      result.push(randomProducts[index]);
    }
    return result;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <div 
      className="relative w-full py-12"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
            Productos <span className="text-mixxo-cyan-bright">Destacados</span>
          </h2>
          <p className="text-white/90 text-xl font-medium">
            Descubre nuestras mejores ofertas
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 glass-dark text-white p-3 rounded-full hover:scale-110 transition-all duration-200 shadow-2xl backdrop-blur-md -translate-x-1/2 md:-translate-x-4"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 glass-dark text-white p-3 rounded-full hover:scale-110 transition-all duration-200 shadow-2xl backdrop-blur-md translate-x-1/2 md:translate-x-4"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="carousel-card group cursor-pointer animate-fade-in"
                onClick={() => handleProductClick(product.id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <div className="badge-new shimmer">
                      NUEVO
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="badge-mixxo">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Imagen */}
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay con acciones */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                        className="glass-dark text-white p-3 rounded-full hover:scale-110 transition-all duration-200 backdrop-blur-md"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-gradient-mixxo text-white p-3 rounded-full hover:scale-110 transition-all duration-200 shadow-mixxo"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  {/* Categoría */}
                  <span className="text-xs font-bold text-mixxo-pink-500 bg-mixxo-pink-50 px-3 py-1.5 rounded-full">
                    {product.subcategoryName || product.categoryName}
                  </span>

                  {/* Nombre */}
                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2 group-hover:text-gradient-mixxo transition-all min-h-[3.5rem]">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'star-filled fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {product.rating}
                    </span>
                  </div>

                  {/* Precio */}
                  <div className="flex items-baseline gap-2">
                    <span className="price-tag text-2xl">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-8">
            {randomProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white shadow-mixxo'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCarousel;