// src/components/ProductDetail.js - Versión mixxo moderna
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Check, AlertCircle, Zap, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import ImageGallery from './ImageGallery';
import ProductSpecs from './ProductSpecs';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import { productReviews } from '../data/products';
import MetaPixel from '../services/MetaPixel';

const ProductDetail = ({ productId, onBack, onProductClick }) => {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [variantError, setVariantError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { getProductById, getProductsByCategory } = useProducts();

  const product = getProductById(productId);
  const reviews = productReviews[productId] || [];

  useEffect(() => {
  if (product) {
    MetaPixel.trackViewContent({
      id: product.id,
      name: product.name,
      category: product.categoryName || product.category,
      price: product.price
    });
  }
}, [product]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      const variantsByType = product.variants.reduce((acc, variant) => {
        if (!acc[variant.type]) {
          acc[variant.type] = [];
        }
        acc[variant.type].push(variant);
        return acc;
      }, {});
      
      const initialSelection = {};
      Object.keys(variantsByType).forEach(type => {
        const firstAvailable = variantsByType[type].find(v => v.available && v.stock > 0);
        if (firstAvailable) {
          initialSelection[type] = firstAvailable;
        }
      });
      
      setSelectedVariants(initialSelection);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-gradient-mixxo rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
            <AlertCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">Producto no encontrado</h2>
          <p className="text-gray-600 mb-8 text-lg">El producto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={onBack}
            className="btn-mixxo"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

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
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'star-filled fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleSelectVariant = (type, variant) => {
    if (variant.available && variant.stock > 0) {
      setSelectedVariants(prev => ({
        ...prev,
        [type]: variant
      }));
      setVariantError('');
    }
  };

  const getVariantTypes = () => {
    if (!product?.variants || product.variants.length === 0) return {};
    
    return product.variants.reduce((acc, variant) => {
      if (!acc[variant.type]) {
        acc[variant.type] = [];
      }
      acc[variant.type].push(variant);
      return acc;
    }, {});
  };

  const getAvailableStock = () => {
    const variantTypes = Object.keys(selectedVariants);
    
    if (variantTypes.length === 0) {
      return product?.stockQuantity || product?.stock || 0;
    }
    
    const matchingVariant = product?.variants?.find(v => {
      return variantTypes.every(type => {
        return selectedVariants[type]?.value === v.value && selectedVariants[type]?.type === v.type;
      });
    });
    
    return matchingVariant?.stock || 0;
  };

  const handleAddToCart = async () => {
  const variantTypes = getVariantTypes();
  const requiredTypes = Object.keys(variantTypes);
  
  if (requiredTypes.length > 0) {
    const missingTypes = requiredTypes.filter(type => !selectedVariants[type]);
    
    if (missingTypes.length > 0) {
      const typeLabels = {
        'color': 'color',
        'size': 'talla',
        'storage': 'almacenamiento',
        'ram': 'memoria RAM'
      };
      
      const missingLabels = missingTypes.map(t => typeLabels[t] || t).join(', ');
      setVariantError(`Por favor selecciona: ${missingLabels}`);
      return;
    }
  }
  
  setIsAddingToCart(true);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const productWithVariants = {
    ...product,
    selectedVariants: Object.values(selectedVariants)
  };
  
  for (let i = 0; i < quantity; i++) {
    addToCart(productWithVariants);
  }
  
  // 🎯 META PIXEL: Rastrear agregar al carrito
  MetaPixel.trackAddToCart(product, quantity);
  
  setIsAddingToCart(false);
  setShowNotification(true);
  setTimeout(() => setShowNotification(false), 3000);
};
  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxStock = getAvailableStock();
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const calculateSavings = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return (product.originalPrice - product.price) * quantity;
    }
    return 0;
  };

  const savings = calculateSavings();
  const isProductInWishlist = isInWishlist(product.id);
  
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Notification flotante */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 glass-card p-6 rounded-2xl shadow-mixxo-lg animate-slide-in max-w-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-mixxo rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 mb-1">¡Agregado al carrito!</div>
              <div className="text-sm text-gray-600">{quantity}x {product.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="glass-card border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-3 text-sm">
            <button 
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-mixxo-pink-500 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-mixxo-pink-500 font-semibold">{product.categoryName || product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ImageGallery images={product.images || [product.image]} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-mixxo-pink-500 bg-mixxo-pink-50 px-4 py-2 rounded-full">
                {product.brand}
              </span>
              {product.isNew && (
                <span className="badge-new">
                  <Sparkles className="w-3 h-3" />
                  NUEVO
                </span>
              )}
              {product.discount > 0 && (
                <span className="badge-mixxo">
                  <Zap className="w-3 h-3" />
                  -{product.discount}%
                </span>
              )}
              {product.isFeatured && (
                <span className="badge-cyan">
                  <Star className="w-3 h-3 fill-current" />
                  DESTACADO
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.rating || 4)}</div>
                <span className="text-xl font-bold text-gray-900">{product.rating || 4}</span>
              </div>
              <span className="text-gray-600 font-medium">({product.totalReviews || product.reviews || 0} reseñas)</span>
            </div>

            {/* Price */}
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl font-black text-gradient-mixxo">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="space-y-1">
                    <span className="text-xl text-gray-400 line-through block">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-green-600 block">
                      Ahorras {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                )}
              </div>
              
              {savings > 0 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-lg">¡Oferta increíble!</div>
                    <div className="text-sm">Ahorras {formatPrice(savings)} en esta compra</div>
                  </div>
                </div>
              )}
            </div>

            {/* Selector de Variantes */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-5">
                {Object.entries(getVariantTypes()).map(([type, variants]) => {
                  const typeLabels = {
                    'color': 'Color',
                    'size': 'Talla',
                    'storage': 'Almacenamiento',
                    'ram': 'Memoria RAM'
                  };
                  
                  const selectedVariant = selectedVariants[type];
                  
                  return (
                    <div key={type} className="glass-card p-5 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                          {typeLabels[type] || type}: 
                          {selectedVariant && (
                            <span className="ml-2 text-mixxo-pink-500">{selectedVariant.name}</span>
                          )}
                        </h3>
                        {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                          <span className="text-sm text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full">
                            ¡Solo {selectedVariant.stock}!
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {variants.map((variant, index) => {
                          const isSelected = selectedVariant?.id === variant.id || 
                                           (selectedVariant?.name === variant.name && selectedVariant?.value === variant.value);
                          const isAvailable = variant.available && variant.stock > 0;
                          
                          return (
                            <button
                              key={variant.id || index}
                              onClick={() => handleSelectVariant(type, variant)}
                              disabled={!isAvailable}
                              className={`relative flex items-center gap-3 px-5 py-3 border-2 rounded-2xl transition-all font-medium ${
                                isSelected
                                  ? 'border-mixxo-pink-500 bg-gradient-to-r from-mixxo-pink-50 to-mixxo-purple-50 shadow-mixxo'
                                  : isAvailable
                                  ? 'border-gray-200 hover:border-mixxo-pink-300 hover:bg-mixxo-pink-50'
                                  : 'border-gray-200 opacity-50 cursor-not-allowed bg-gray-50'
                              }`}
                            >
                              {type === 'color' ? (
                                <div className="relative">
                                  <div
                                    className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-inner"
                                    style={{ backgroundColor: variant.value }}
                                  />
                                  {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <Check className="w-6 h-6 text-white drop-shadow-lg" />
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                                  isSelected ? 'bg-gradient-mixxo text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {variant.value?.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              
                              <div className="text-left">
                                <span className={`font-bold block ${
                                  isAvailable ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {variant.name}
                                </span>
                                {!isAvailable && (
                                  <span className="text-xs text-red-500 block">Agotado</span>
                                )}
                              </div>
                              
                              {isSelected && (
                                <Check className="w-5 h-5 text-mixxo-pink-500 ml-auto" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                
                {variantError && (
                  <div className="flex items-center gap-3 text-red-600 bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <span className="font-bold">{variantError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="glass-card p-5 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cantidad</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-4 hover:bg-mixxo-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-8 py-4 font-black text-xl min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= getAvailableStock()}
                    className="p-4 hover:bg-mixxo-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  <span className="font-bold text-gray-900">{getAvailableStock()}</span> disponibles
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={getAvailableStock() === 0 || isAddingToCart}
                  className="flex-1 btn-mixxo text-lg py-5 disabled:opacity-50"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="spinner-mixxo border-white mr-3"></div>
                      <span>Agregando...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      <span>
                        {getAvailableStock() > 0 
                          ? 'Agregar al carrito' 
                          : 'No disponible'}
                      </span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-5 border-2 rounded-2xl transition-all ${
                    isProductInWishlist
                      ? 'border-mixxo-pink-500 bg-mixxo-pink-50 text-mixxo-pink-500'
                      : 'border-gray-200 hover:border-mixxo-pink-300 text-gray-600'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isProductInWishlist ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-5 border-2 border-gray-200 hover:border-mixxo-cyan-300 text-gray-600 rounded-2xl transition-all">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:shadow-mixxo transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-mixxo-pink-500 to-mixxo-purple-500 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Envío gratis</div>
                    <div className="text-sm text-gray-600">24-48 horas</div>
                  </div>
                </div>
                <div className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:shadow-cyan transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Garantía</div>
                    <div className="text-sm text-gray-600">{product.warranty || '12 meses'}</div>
                  </div>
                </div>
                <div className="glass-card p-5 rounded-2xl flex items-center gap-3 hover:shadow-purple transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-mixxo-purple-500 to-mixxo-pink-500 rounded-xl flex items-center justify-center">
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Devoluciones</div>
                    <div className="text-sm text-gray-600">30 días</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="glass-card rounded-3xl overflow-hidden mb-16">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-2 px-6">
              {[
                { key: 'description', label: 'Descripción' },
                { key: 'specs', label: 'Especificaciones' },
                { key: 'reviews', label: `Reseñas (${reviews.length})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-5 px-6 font-bold text-sm transition-all relative ${
                    activeTab === tab.key
                      ? 'text-mixxo-pink-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-mixxo rounded-t-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">Descripción del producto</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>
                
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 mb-6">Características principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 glass-card p-4 rounded-2xl">
                          <div className="w-6 h-6 bg-gradient-mixxo rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'specs' && (
              <ProductSpecs specifications={product.specifications || []} />
            )}
            
            {activeTab === 'reviews' && (
              <ProductReviews 
                reviews={reviews} 
                productRating={product.rating || 4} 
                totalReviews={product.totalReviews || product.reviews || 0}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                También te puede <span className="text-gradient-mixxo">interesar</span>
              </h2>
              <p className="text-gray-600 text-lg">Productos similares seleccionados para ti</p>
            </div>
            <RelatedProducts 
              products={relatedProducts} 
              category={product.categoryName || product.category}
              onProductClick={onProductClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
