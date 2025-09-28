import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw, Minus, Plus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext'; // ← NUEVO
import ImageGallery from './ImageGallery';
import ProductSpecs from './ProductSpecs';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import { productReviews } from '../data/products';

const ProductDetail = ({ productId, onBack, onProductClick }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { getProductById, getProductsByCategory } = useProducts(); // ← NUEVO

  // ← CAMBIO: Usar contexto en lugar de sampleProducts
  const product = getProductById(productId);
  const reviews = productReviews[productId] || [];

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Seleccionar la primera variante disponible
      const firstAvailable = product.variants.find(v => v.available);
      setSelectedVariant(firstAvailable || product.variants[0]);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
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
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setIsAddingToCart(false);
    setShowNotification(true);
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    const maxStock = product.stockQuantity || product.stock || 0;
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
  
  // ← CAMBIO: Usar función del contexto para productos relacionados
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 animate-slide-in">
          <Check className="w-6 h-6" />
          <div>
            <div className="font-semibold">¡Agregado al carrito!</div>
            <div className="text-sm">{quantity}x {product.name}</div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={onBack}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-blue-600">{product.categoryName || product.category}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images || [product.image]} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm text-blue-600 font-medium">{product.brand}</span>
                {product.isNew && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                    NUEVO
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                    -{product.discount}%
                  </span>
                )}
                {product.isFromAdmin && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-semibold">
                    ADMIN
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(product.rating || 4)}</div>
                  <span className="text-lg font-semibold text-gray-900">{product.rating || 4}</span>
                </div>
                <span className="text-gray-600">({product.totalReviews || product.reviews || 0} reseñas)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {savings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-green-800 font-semibold">
                    🎉 Ahorras {formatPrice(savings)} en esta compra
                  </div>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Color: {selectedVariant?.name}</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => variant.available && setSelectedVariant(variant)}
                      disabled={!variant.available}
                      className={`flex items-center space-x-3 px-4 py-3 border-2 rounded-lg transition-all ${
                        selectedVariant?.name === variant.name
                          ? 'border-blue-500 bg-blue-50'
                          : variant.available
                          ? 'border-gray-300 hover:border-gray-400'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: variant.color }}
                      />
                      <span className={`font-medium ${
                        variant.available ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {variant.name}
                      </span>
                      {!variant.available && (
                        <span className="text-xs text-red-500">(Agotado)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Cantidad</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stockQuantity || product.stock || 0)}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {product.stockQuantity || product.stock || 0} disponibles
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!(product.inStock !== false && (product.stockQuantity || product.stock || 0) > 0) || isAddingToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Agregando...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {(product.inStock !== false && (product.stockQuantity || product.stock || 0) > 0) 
                          ? 'Agregar al carrito' 
                          : 'No disponible'}
                      </span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    isProductInWishlist
                      ? 'border-red-500 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isProductInWishlist ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-4 border-2 border-gray-300 hover:border-gray-400 text-gray-600 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Envío gratis</div>
                    <div className="text-sm text-gray-600">24-48 horas</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Garantía</div>
                    <div className="text-sm text-gray-600">{product.warranty || '12 meses'}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Devoluciones</div>
                    <div className="text-sm text-gray-600">30 días</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'description', label: 'Descripción' },
                { key: 'specs', label: 'Especificaciones' },
                { key: 'reviews', label: `Reseñas (${reviews.length})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Descripción del producto</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>
                
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Características principales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
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
          <RelatedProducts 
            products={relatedProducts} 
            category={product.categoryName || product.category}
            onProductClick={onProductClick}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;