// src/components/chatbot/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatbotEngine from './ChatbotEngine';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import MetaPixel from '../../services/MetaPixel';

const Chatbot = ({ 
  phoneNumber = '573144505320',
  companyName = 'mixxo'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [showPulse, setShowPulse] = useState(true);

  const messagesEndRef = useRef(null);
  const chatbotEngineRef = useRef(null);

  const { products } = useProducts();
  const { categories } = useCategories();
  const { user, isAuthenticated, openLoginModal } = useAuth();

  // Inicializar el motor del chatbot
  useEffect(() => {
    chatbotEngineRef.current = new ChatbotEngine(products, categories, userOrders);
  }, []);

  // Actualizar datos del motor cuando cambien
  useEffect(() => {
    if (chatbotEngineRef.current) {
      chatbotEngineRef.current.updateData(products, categories, userOrders);
    }
  }, [products, categories, userOrders]);

  // Cargar pedidos del usuario
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserOrders();
    }
  }, [isAuthenticated, user]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mensaje de bienvenida
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          `¡Hola${user?.firstName ? ` ${user.firstName}` : ''}! 👋\n\nSoy el asistente virtual de ${companyName}. Estoy aquí para ayudarte.\n\n¿En qué puedo ayudarte hoy?`,
          'text',
          [
            { label: '🔍 Buscar productos', value: 'search' },
            { label: '📦 Ver mis pedidos', value: 'orders' },
            { label: '🚚 Info de envíos', value: 'shipping' },
            { label: '💳 Métodos de pago', value: 'payment' }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  // Desactivar pulse después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const fetchUserOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setUserOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addBotMessage = (content, type = 'text', options = null) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      content,
      type,
      isBot: true,
      timestamp: new Date(),
      options
    }]);
  };

  const addUserMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      content,
      type: 'text',
      isBot: false,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async (message = inputValue) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    // Agregar mensaje del usuario
    addUserMessage(trimmedMessage);
    setInputValue('');
    setIsTyping(true);

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Analizar intención
    const intent = chatbotEngineRef.current.analyzeIntent(trimmedMessage);
    
    // Procesar según intención
    if (intent.intent === 'search_product') {
      const results = chatbotEngineRef.current.searchProducts(trimmedMessage);
      
      if (results.length > 0) {
        addBotMessage(`Encontré ${results.length} producto(s) que podrían interesarte:`);
        
        // Agregar productos uno por uno con delay
        results.forEach((product, index) => {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              content: null,
              type: 'product',
              data: product,
              isBot: true,
              timestamp: new Date()
            }]);
          }, (index + 1) * 300);
        });

        setTimeout(() => {
          addBotMessage(
            '¿Te gustaría ver más productos o necesitas ayuda con algo más?',
            'text',
            [
              { label: '🔍 Buscar otros productos', value: 'search' },
              { label: '💬 Hablar con asesor', value: 'human' }
            ]
          );
        }, results.length * 300 + 500);
      } else {
        addBotMessage(
          'No encontré productos con esa búsqueda. 😔\n\n¿Podrías intentar con otras palabras o explorar por categorías?',
          'text',
          [
            { label: '🔍 Intentar otra búsqueda', value: 'search' },
            { label: '📁 Ver categorías', value: 'categories' }
          ]
        );
      }
    } else if (intent.intent === 'order_status' && isAuthenticated) {
      if (userOrders.length > 0) {
        addBotMessage(`Tienes ${userOrders.length} pedido(s):`);
        
        userOrders.forEach((order, index) => {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              content: null,
              type: 'order',
              data: {
                ...order,
                itemCount: order.order_items?.length || 0
              },
              isBot: true,
              timestamp: new Date()
            }]);
          }, (index + 1) * 300);
        });
      } else {
        addBotMessage('No tienes pedidos registrados aún. 🛍️\n\n¿Te gustaría explorar nuestros productos?');
      }
    } else {
      const response = chatbotEngineRef.current.generateResponse(intent, user);
      addBotMessage(response.message, response.type, response.options);
    }

    setIsTyping(false);
  };

  const handleOptionClick = (option) => {
    if (option.value === 'human') {
      handleWhatsAppRedirect();
      return;
    }

    if (option.value === 'login') {
      openLoginModal();
      setIsOpen(false);
      return;
    }

    const optionMessages = {
      search: 'Buscar productos',
      orders: 'Ver mis pedidos',
      shipping: 'Información de envíos',
      payment: 'Métodos de pago',
      categories: 'Ver categorías'
    };

    handleSendMessage(optionMessages[option.value] || option.label);
  };

  const handleWhatsAppRedirect = () => {
    // Track en Meta Pixel
    MetaPixel.trackContact('whatsapp');

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    let message = 'Hola! Necesito hablar con un asesor';
    
    if (user) {
      message += `\n\n👤 ${user.firstName} ${user.lastName}\n📧 ${user.email}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {showPulse && (
            <>
              <div className="absolute inset-0 bg-gradient-mixxo rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-0 bg-gradient-mixxo rounded-full animate-pulse opacity-50"></div>
            </>
          )}
          
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-mixxo hover:scale-110 text-white w-16 h-16 rounded-full shadow-mixxo-lg flex items-center justify-center transition-all duration-300 group"
            aria-label="Abrir chatbot"
          >
            <Bot className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
          </button>
        </div>
      )}

      {/* Panel del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-mixxo text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-mixxo-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{companyName} Bot</h3>
                <div className="flex items-center space-x-1 text-xs">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span>En línea</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.options ? (
                  <>
                    <ChatMessage
                      message={msg.content}
                      isBot={msg.isBot}
                      timestamp={msg.timestamp}
                      type={msg.type}
                    />
                    <div className="ml-10 mb-4 space-y-2">
                      {msg.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionClick(option)}
                          className="w-full text-left px-4 py-2.5 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-sm font-medium text-gray-700 hover:border-mixxo-pink-500 hover:text-mixxo-pink-500"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <ChatMessage
                    message={msg.content}
                    type={msg.type}
                    data={msg.data}
                    isBot={msg.isBot}
                    timestamp={msg.timestamp}
                  />
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500 text-sm ml-10 mb-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>escribiendo...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-mixxo-pink-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-mixxo text-white p-2.5 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={handleWhatsAppRedirect}
              className="w-full mt-3 text-green-600 hover:text-green-700 text-xs font-medium flex items-center justify-center space-x-1 py-2 hover:bg-green-50 rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hablar con un asesor en WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Chatbot;