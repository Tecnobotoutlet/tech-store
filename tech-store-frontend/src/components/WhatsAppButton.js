// src/components/WhatsAppButton.js - Con Chatbot
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Search, Package, ChevronRight } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';

const WhatsAppButton = ({ 
  phoneNumber = '573001234567',
  position = 'right',
  showTooltip = true,
  companyName = 'TechStore'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  
  // Estados del chatbot
  const [chatStep, setChatStep] = useState('main'); // 'main', 'selectType', 'categories', 'search', 'productList'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { products } = useProducts();
  const { categories } = useCategories();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    const pulseTimer = setTimeout(() => setShowPulse(false), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleWhatsAppClick = (customMessage = null) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const message = customMessage || 'Hola! Tengo una consulta';
    const encodedMessage = encodeURIComponent(message);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    resetChat();
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setShowPulse(false);
    if (!isExpanded) {
      resetChat();
    }
  };

  const resetChat = () => {
    setChatStep('main');
    setSelectedCategory(null);
    setSearchQuery('');
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Obtener productos por categoría
  const getProductsByCategory = (categoryName) => {
    return products.filter(p => 
      p.categoryName?.toLowerCase() === categoryName.toLowerCase() ||
      p.category?.toLowerCase() === categoryName.toLowerCase()
    );
  };

  // Buscar productos
  const searchProducts = (query) => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q)
    ).slice(0, 10);
  };

  const handleProductSelect = (product) => {
    const message = `Hola! Tengo una consulta sobre este producto:

📦 *${product.name}*
💰 Precio: ${formatPrice(product.price)}
🏷️ Categoría: ${product.categoryName || product.category}
${product.brand ? `🔖 Marca: ${product.brand}` : ''}

¿Me pueden dar más información?`;
    
    handleWhatsAppClick(message);
  };

  const positionClasses = position === 'left' ? 'left-6' : 'right-6';

  if (!isVisible) return null;

  // RENDERIZADO PRINCIPAL
  const renderMainMenu = () => (
    <>
      <div className="p-4 bg-gray-50">
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <p className="text-gray-700 text-sm">
            Hola! Estamos aquí para ayudarte con cualquier pregunta sobre nuestros productos.
          </p>
          <div className="mt-3 text-xs text-gray-500">
            Horario: Lun-Vie 8:00-18:00
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={() => setChatStep('selectType')}
            className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Consultar sobre producto</div>
                  <div className="text-xs text-gray-500">Busca y pregunta por productos</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          <button
            onClick={() => {
              handleWhatsAppClick('Hola! Quiero hacer seguimiento a mi pedido');
            }}
            className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Seguimiento de pedido</div>
                <div className="text-xs text-gray-500">Estado de tu compra</div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => handleWhatsAppClick('Hola! Tengo una consulta')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat directo en WhatsApp</span>
        </button>
      </div>
    </>
  );

  // SELECCIONAR TIPO DE BÚSQUEDA
  const renderSelectType = () => (
    <div className="p-4 bg-gray-50">
      <button
        onClick={() => setChatStep('main')}
        className="text-blue-600 text-sm mb-4 flex items-center"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <p className="text-gray-700 text-sm font-medium mb-2">
          ¿Cómo quieres buscar el producto?
        </p>
        <p className="text-xs text-gray-500">
          Selecciona una opción para continuar
        </p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => setChatStep('categories')}
          className="w-full text-left px-4 py-4 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Por Categoría</div>
                <div className="text-xs text-gray-500">Explora por tipo de producto</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        <button
          onClick={() => setChatStep('search')}
          className="w-full text-left px-4 py-4 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Buscar por Nombre</div>
                <div className="text-xs text-gray-500">Escribe el producto que buscas</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </div>
    </div>
  );

  // LISTA DE CATEGORÍAS
  const renderCategories = () => {
    const categoryList = Object.values(categories);

    return (
      <div className="p-4 bg-gray-50">
        <button
          onClick={() => setChatStep('selectType')}
          className="text-blue-600 text-sm mb-4 flex items-center"
        >
          ← Volver
        </button>

        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <p className="text-gray-700 text-sm font-medium">
            Selecciona una categoría
          </p>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categoryList.map((category, index) => {
            const productCount = getProductsByCategory(category.name).length;
            
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setChatStep('productList');
                }}
                className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-xs text-gray-500">{productCount} productos</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // BÚSQUEDA POR NOMBRE
  const renderSearch = () => {
    const results = searchProducts(searchQuery);

    return (
      <div className="p-4 bg-gray-50">
        <button
          onClick={() => {
            setChatStep('selectType');
            setSearchQuery('');
          }}
          className="text-blue-600 text-sm mb-4 flex items-center"
        >
          ← Volver
        </button>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="w-full text-left p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="flex space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm line-clamp-2">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.categoryName}
                      </div>
                      <div className="text-sm font-semibold text-blue-600 mt-1">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No se encontraron productos
              </div>
            )}
          </div>
        )}

        {!searchQuery.trim() && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Escribe para buscar productos
          </div>
        )}
      </div>
    );
  };

  // LISTA DE PRODUCTOS DE LA CATEGORÍA
  const renderProductList = () => {
    const categoryProducts = getProductsByCategory(selectedCategory);

    return (
      <div className="p-4 bg-gray-50">
        <button
          onClick={() => {
            setChatStep('categories');
            setSelectedCategory(null);
          }}
          className="text-blue-600 text-sm mb-4 flex items-center"
        >
          ← Volver a categorías
        </button>

        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <p className="text-gray-700 text-sm font-medium">
            {selectedCategory}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {categoryProducts.length} productos disponibles
          </p>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categoryProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className="w-full text-left p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              <div className="flex space-x-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm line-clamp-2">
                    {product.name}
                  </div>
                  {product.brand && (
                    <div className="text-xs text-gray-500 mt-1">
                      {product.brand}
                    </div>
                  )}
                  <div className="text-sm font-semibold text-blue-600 mt-1">
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Botón principal */}
      <div
        className={`fixed bottom-6 ${positionClasses} z-50 transition-all duration-300 ${
          isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {showTooltip && !isExpanded && (
          <div
            className={`absolute bottom-full mb-2 ${
              position === 'left' ? 'left-0' : 'right-0'
            } bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-800 whitespace-nowrap animate-bounce`}
          >
            Chatea con nosotros
            <div
              className={`absolute top-full ${
                position === 'left' ? 'left-4' : 'right-4'
              } w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white`}
            />
          </div>
        )}

        {showPulse && (
          <>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50" />
          </>
        )}

        <button
          onClick={toggleExpanded}
          className="relative bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
          aria-label="Abrir chat de WhatsApp"
        >
          <MessageCircle className="w-8 h-8 transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Panel expandido */}
      <div
        className={`fixed bottom-6 ${positionClasses} z-50 transition-all duration-300 ${
          isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{companyName}</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <span>Disponible ahora</span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleExpanded}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body - Renderizado condicional según el paso */}
          {chatStep === 'main' && renderMainMenu()}
          {chatStep === 'selectType' && renderSelectType()}
          {chatStep === 'categories' && renderCategories()}
          {chatStep === 'search' && renderSearch()}
          {chatStep === 'productList' && renderProductList()}
        </div>
      </div>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={toggleExpanded}
        />
      )}
    </>
  );
};

export default WhatsAppButton;
