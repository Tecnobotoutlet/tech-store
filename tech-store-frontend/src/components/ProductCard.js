// src/components/ProductCard.js - Versión Mejorada y Profesional
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Eye, Cpu, HardDrive, Zap, Monitor, Camera, Battery, Palette, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onProductClick, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const {
    id,
    name,
    price,
    originalPrice,
    image,
    rating,
    reviews,
    discount,
    categoryName,
    subcategoryName,
    brand,
    specifications,
    inStock,
    stockQuantity,
    isNew,
    isFeatured,
    tags
  } = product;

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (inStock) {
      addToCart(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product.id);
    }
  };

  const isProductInWishlist = isInWishlist && isInWishlist(product.id);

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
        className={`w-3.5 h-3.5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSpecIcon = (specType) => {
    const icons = {
      processor: Cpu,
      storage: HardDrive,
      battery: Zap,
      ram: Cpu,
      display: Monitor,
      camera: Camera,
      graphics: Monitor,
      material: Palette,
      technology: Sparkles,
      default: Tag
    };
    return icons[specType] || icons.default;
  };

  const getStockStatus = () => {
    if (!inStock) return { text: 'Agotado', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stockQuantity <= 5) return { text: `Solo ${stockQuantity} disponibles`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { text: 'En stock', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group relative cursor-pointer border border-gray-100 hover:border-blue-200 ${className}`}
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {isNew && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
            <Sparkles className="w-3 h-3" />
            NUEVO
          </div>
        )}
        {discount > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
            -{discount}%
          </div>
        )}
        {isFeatured && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
            DESTACADO
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
      >
        <Heart
          className={`w-4 h-4 ${
            isProductInWishlist ? 'text-red-500 fill-current' : 'text-gray-600 hover:text-red-500'
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-200 w-full h-full flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex gap-3">
            <button 
              onClick={handleQuickViewClick}
              className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-110 shadow-lg"
              title="Vista rápida"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={handleAddToCartClick}
              disabled={!inStock}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 shadow-lg"
              title={inStock ? "Agregar al carrito" : "No disponible"}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category and Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {subcategoryName || categoryName}
          </span>
          <span className="text-xs text-gray-500 font-medium">{brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
          {name}
        </h3>

        {/* Specifications Preview */}
        {specifications && specifications.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-2">
              {specifications.slice(0, 2).map((spec, index) => {
                const IconComponent = getSpecIcon(spec.type);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700">{spec.label}:</span>
                    <span className="truncate">{spec.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-sm text-gray-600 font-medium">
            {rating}
          </span>
          <span className="text-xs text-gray-500">
            ({reviews} reseñas)
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Ahorras {formatPrice(originalPrice - price)}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className={`mb-4 text-sm font-medium px-3 py-2 rounded-lg ${stockStatus.bgColor} ${stockStatus.color}`}>
          {stockStatus.text}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCartClick}
          disabled={!inStock}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            inStock
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {inStock ? 'Agregar al carrito' : 'No disponible'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;