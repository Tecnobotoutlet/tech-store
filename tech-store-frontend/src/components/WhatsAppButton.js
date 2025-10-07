// src/components/WhatsAppButton.js - Con Chatbot y Detección de Pedidos
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Search, Package, ChevronRight, Clock, ShoppingBag, AlertCircle } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

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
  const [chatStep, setChatStep] = useState('main');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // 🔥 NUEVO: Estados para pedidos del usuario
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const { products } = useProducts();
  const { categories } = useCategories();
  const { user, isAuthenticated } = useAuth();

  // 🔥 NUEVO: Cargar pedidos del usuario al abrir el chat
  useEffect(() => {
    if (isExpanded && isAuthenticated && user?.id) {
      fetchUserOrders();
    }
  }, [isExpanded, isAuthenticated, user]);

  // 🔥 NUEVO: Función para obtener pedidos del usuario
  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setUserOrders(orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

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
    let message = customMessage || 'Hola! Tengo una consulta';
    
    // 🔥 NUEVO: Agregar información de pedidos al mensaje si el usuario está autenticado
    if (isAuthenticated && user && userOrders.length > 0) {
      const pendingOrders = userOrders.filter(o => 
        o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed'
      );
      
      if (pendingOrders.length > 0) {
        message += `\n\n📦 *Mis pedidos activos:*\n`;
        pendingOrders.forEach((order, index) => {
          const itemsCount = order.order_items?.length || 0;
          const statusEmoji = {
            'pending': '⏳',
            'processing': '📦',
            'confirmed': '✅'
          }[order.status] || '📋';
          
          message += `\n${index + 1}. Pedido #${order.id} ${statusEmoji}`;
          message += `\n   - ${itemsCount} producto${itemsCount !== 1 ? 's' : ''}`;
          message += `\n   - Total: ${formatPrice(order.total)}`;
          message += `\n   - Estado: ${getStatusText(order.status)}`;
        });
        
        message += `\n\n👤 Cliente: ${user.firstName || ''} ${user.lastName || ''}`;
        message += `\n📧 Email: ${user.email}`;
      }
    }
    
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

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmado',
      'processing': 'En proceso',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-purple-100 text-purple-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
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
    let message = `Hola! Tengo una consulta sobre este producto:

📦 *${product.name}*
💰 Precio: ${formatPrice(product.price)}
🏷️ Categoría: ${product.categoryName || product.category}
${product.brand ? `🔖 Marca: ${product.brand}` : ''}

¿Me pueden dar más información?`;

    // Agregar contexto de pedidos si está autenticado
    if (isAuthenticated && user) {
      message += `\n\n👤 Cliente: ${user.firstName || ''} ${user.lastName || ''}`;
      message += `\n📧 Email: ${user.email}`;
    }
    
    handleWhatsAppClick(message);
  };

  // 🔥 NUEVO: Consultar sobre un pedido específico
  const handleOrderSelect = (order) => {
    const items = order.order_items || [];
    let message = `Hola! Tengo una consulta sobre mi pedido:

📦 *Pedido #${order.id}*
📅 Fecha: ${formatDate(order.created_at)}
💰 Total: ${formatPrice(order.total)}
📍 Estado: ${getStatusText(order.status)}

*Productos:*`;

    items.forEach((item, index) => {
      message += `\n${index + 1}. ${item.product_name} x${item.quantity}`;
      message += `\n   ${formatPrice(item.unit_price)} c/u`;
    });

    message += `\n\n👤 Cliente: ${user.firstName || ''} ${user.lastName || ''}`;
    message += `\n📧 Email: ${user.email}`;
    message += `\n📱 Teléfono: ${order.customer_phone || user.phone || ''}`;
    message += `\n\n¿Me pueden ayudar con este pedido?`;

    handleWhatsAppClick(message);
  };

  const positionClasses = position === 'left' ? 'left-6' : 'right-6';

  if (!isVisible) return null;

  // RENDERIZADO PRINCIPAL
  const renderMainMenu = () => (
    <>
      <div className="p-4 bg-gray-50">
        {/* 🔥 NUEVO: Resumen de pedidos del usuario */}
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 text-sm">
                  Hola, {user?.firstName || 'Cliente'}!
                </h4>
              </div>
              {loadingOrders && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            
            {!loadingOrders && userOrders.length > 0 && (
              <div className="space-y-2">
                {userOrders.filter(o => 
                  o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed'
                ).length > 0 ? (
                  <>
                    <p className="text-xs text-blue-700 mb-2">
                      Tienes {userOrders.filter(o => 
                        o.status === 'pending' || o.status === 'processing' || o.status === 'confirmed'
                      ).length} pedido(s) activo(s)
                    </p>
                    <button
                      onClick={() => setChatStep('orders')}
                      className="w-full text-left px-3 py-2 bg-white rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <span className="text-blue-600 font-medium">Ver mis pedidos</span>
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">No tienes pedidos activos</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <p className="text-gray-700 text-sm">
            Estamos aquí para ayudarte con cualquier pregunta sobre productos o pedidos.
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

          {isAuthenticated && userOrders.length > 0 && (
            <button
              onClick={() => setChatStep('orders')}
              className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ver mis pedidos</div>
                    <div className="text-xs text-gray-500">{userOrders.length} pedido(s) en total</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          )}

          <button
            onClick={() => {
              const message = isAuthenticated 
                ? `Hola! Necesito ayuda\n\n👤 Cliente: ${user?.firstName || ''} ${user?.lastName || ''}\n📧 Email: ${user?.email}`
                : 'Hola! Necesito ayuda con una consulta general';
              handleWhatsAppClick(message);
            }}
            className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Otra consulta</div>
                <div className="text-xs text-gray-500">Hablar con un asesor</div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => handleWhatsAppClick()}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat directo en WhatsApp</span>
        </button>
      </div>
    </>
  );

  // 🔥 NUEVO: Vista de pedidos del usuario
  const renderOrders = () => (
    <div className="p-4 bg-gray-50">
      <button
        onClick={() => setChatStep('main')}
        className="text-blue-600 text-sm mb-4 flex items-center"
      >
        ← Volver
      </button>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <h4 className="font-semibold text-gray-900 mb-1">Mis Pedidos</h4>
        <p className="text-xs text-gray-500">
          Selecciona un pedido para consultar
        </p>
      </div>

      {loadingOrders ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : userOrders.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {userOrders.map((order) => {
            const items = order.order_items || [];
            const isActive = ['pending', 'processing', 'confirmed'].includes(order.status);
            
            return (
              <button
                key={order.id}
                onClick={() => handleOrderSelect(order)}
                className="w-full text-left p-4 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      Pedido #{order.id}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700 mb-2">
                  {items.length} producto{items.length !== 1 ? 's' : ''}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-blue-600">
                    {formatPrice(order.total)}
                  </div>
                  {isActive && (
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <Clock className="w-3 h-3" />
                      <span>Activo</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No tienes pedidos aún</p>
        </div>
      )}
    </div>
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
          {chatStep === 'orders' && renderOrders()}
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
