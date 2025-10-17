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
    onProductClick(product.id, product.slug);
  }
};

  const handleProductClick = () => {
  if (onProductClick) {
    // Pasar tanto el ID como el slug
    onProductClick(product.id, product.slug);
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
        className={`w-3 h-3 ${
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
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        {isNew && (
          <div className="badge-new shimmer text-[10px] px-2 py-0.5">
  <Sparkles className="w-2.5 h-2.5" />
  NUEVO
</div>
        )}
        {discount > 0 && (
          <div className="badge-mixxo text-[10px] px-2 py-0.5">
  <Zap className="w-2.5 h-2.5" />
  -{discount}%
</div>
        )}
        {isFeatured && !isNew && (
          <div className="badge-cyan text-[10px] px-2 py-0.5">
  <Star className="w-2.5 h-2.5 fill-current" />
  TOP
</div>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
          isProductInWishlist
            ? 'bg-mixxo-pink-500 shadow-mixxo scale-110'
            : 'glass-mixxo hover:scale-110'
        }`}
      >
        <Heart
          className={`w-3 h-3 ${
            isProductInWishlist ? 'text-white fill-current' : 'text-gray-600'
          }`}
        />
      </button>

      {/* Image Container */}
      <div className="product-image-wrapper relative h-40 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="spinner-mixxo w-6 h-6 border-2"></div>
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
              className="glass-dark text-white p-2 rounded-full hover:scale-110 transition-all duration-200 shadow-lg backdrop-blur-md"
              title="Vista rápida"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={handleAddToCartClick}
              disabled={!inStock}
              className="bg-gradient-mixxo text-white p-3 rounded-full hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-mixxo"
              title={inStock ? "Agregar al carrito" : "No disponible"}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Category and Brand */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-mixxo-pink-500 bg-mixxo-pink-50 px-2 py-1 rounded-full">
            {subcategoryName || categoryName}
          </span>
          <span className="text-[10px] text-gray-500 font-semibold">{brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gradient-mixxo transition-all leading-tight min-h-[2.5rem]">
          {name}
        </h3>

        {/* Specifications Preview */}
        {specifications && specifications.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-2">
              {specifications.slice(0, 2).map((spec, index) => (
                <div
                  key={index}
                  className="glass-mixxo px-2 py-0.5 rounded-full text-[10px] font-medium text-gray-700"
                >
                  {spec.value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">{renderStars(rating)}</div>
          <span className="text-xs text-gray-900 font-bold">
            {rating}
          </span>
          <span className="text-[10px] text-gray-500">
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1.5 mb-0.5">
            <span className="price-tag text-xl">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <div className="text-xs font-bold text-green-600 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Ahorras {formatPrice(originalPrice - price)}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className={`mb-2 text-xs font-bold px-2 py-1 rounded-lg border ${stockStatus.bgColor} ${stockStatus.color} ${stockStatus.borderColor}`}>
          {stockStatus.text}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCartClick}
          disabled={!inStock}
          className={`w-full py-2 px-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
            inStock
              ? 'btn-mixxo'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inStock ? 'Agregar' : 'No disponible'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
