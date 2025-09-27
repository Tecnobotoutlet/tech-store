import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, ShoppingBag, ArrowLeft, Trash2, Heart } from 'lucide-react';

const Cart = ({ isOpen, onClose, onCheckout }) => {
  const { 
    items, 
    total, 
    itemCount, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    toggleWishlist,
    isInWishlist 
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
  if (items.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  // Cerrar el carrito y navegar al checkout
  onClose();
  if (onCheckout) {
    onCheckout();
  }
};

  const calculateSavings = () => {
    return items.reduce((savings, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return savings + ((item.originalPrice - item.price) * item.quantity);
      }
      return savings;
    }, 0);
  };

  const savings = calculateSavings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">
              Mi Carrito ({itemCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-500 mb-6">
                Agrega algunos productos increíbles para empezar
              </p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continuar comprando</span>
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex space-x-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.category}
                            </p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-1 ml-2">
                            <button
                              onClick={() => toggleWishlist(item)}
                              className="p-1 hover:bg-white rounded transition-colors"
                              title="Agregar a favoritos"
                            >
                              <Heart 
                                className={`w-4 h-4 ${
                                  isInWishlist(item.id) 
                                    ? 'text-red-500 fill-current' 
                                    : 'text-gray-400'
                                }`} 
                              />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-white rounded transition-colors"
                              title="Eliminar del carrito"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          {/* Subtotal */}
                          <span className="font-semibold text-blue-600">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary & Checkout */}
              <div className="border-t p-4 space-y-4">
                {/* Savings */}
                {savings > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">
                        🎉 Total ahorrado:
                      </span>
                      <span className="text-green-700 font-bold">
                        {formatPrice(savings)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} productos)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <span>Proceder al pago</span>
                    )}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={onClose}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Seguir comprando
                    </button>
                    <button
                      onClick={clearCart}
                      className="px-4 border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Vaciar
                    </button>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="text-center text-xs text-gray-500 pt-2">
                  🔒 Compra 100% segura • Garantía de devolución
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;