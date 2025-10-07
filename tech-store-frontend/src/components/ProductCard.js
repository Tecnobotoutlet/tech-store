// src/components/ProductCard.js - Versión mixxo moderna
import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Eye, Zap, Sparkles } from 'lucide-react';
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
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'star-filled fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStockStatus = () => {
    if (!inStock) return { text: 'Agotado', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    if (stockQuantity <= 5) return { text: `¡Solo ${stockQuantity}!`, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { text: 'Disponible', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      onClick={handleProductClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`product-card-mixxo cursor-pointer group ${className}`}
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isNew && (
          <div className="badge-new shimmer">
            <Sparkles className="w-3 h-3" />
            NUEVO
          </div>
        )}
        {discount > 0 && (
          <div className="badge-mixxo">
            <Zap className="w-3 h-3" />
            -{discount}%
          </div>
        )}
        {isFeatured && !isNew && (
          <div className="badge-cyan">
            <Star className="w-3 h-3 fill-current" />
            DESTACADO
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
          isProductInWishlist
            ? 'bg-mixxo-pink-500 shadow-mixxo scale-110'
            : 'glass-mixxo hover:scale-110'
        }`}
      >
        <Heart
          className={`w-5 h-5 ${
            isProductInWishlist ? 'text-white fill-current' : 'text-gray-600'
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="product-image-wrapper relative h-64 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="spinner-mixxo"></div>
          </div>
        )}
        <img
          src={image}
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end justify-center pb-4 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex gap-3">
            <button 
              onClick={handleQuickViewClick}
              className="glass-dark text-white p-3 rounded-full hover:scale-110 transition-all duration-200 shadow-lg backdrop-blur-md"
              title="Vista rápida"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button 
              onClick={handleAddToCartClick}
              disabled={!inStock}
              className="bg-gradient-mixxo text-white p-3 rounded-full hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-mixxo"
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
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-mixxo-pink-500 bg-mixxo-pink-50 px-3 py-1.5 rounded-full">
            {subcategoryName || categoryName}
          </span>
          <span className="text-xs text-gray-500 font-semibold">{brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gradient-mixxo transition-all leading-tight min-h-[3.5rem]">
          {name}
        </h3>

        {/* Specifications Preview */}
        {specifications && specifications.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {specifications.slice(0, 3).map((spec, index) => (
                <div
                  key={index}
                  className="glass-mixxo px-3 py-1.5 rounded-full text-xs font-medium text-gray-700"
                >
                  {spec.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-sm text-gray-900 font-bold">
            {rating}
          </span>
          <span className="text-xs text-gray-500">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="price-tag text-3xl">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="text-sm font-bold text-green-600 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Ahorras {formatPrice(originalPrice - price)}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className={`mb-4 text-sm font-bold px-3 py-2 rounded-xl border-2 ${stockStatus.bgColor} ${stockStatus.color} ${stockStatus.borderColor}`}>
          {stockStatus.text}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCartClick}
          disabled={!inStock}
          className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            inStock
              ? 'btn-mixxo'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {inStock ? 'Agregar' : 'No disponible'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
