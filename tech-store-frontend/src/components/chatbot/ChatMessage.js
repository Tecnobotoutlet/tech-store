// src/components/chatbot/ChatMessage.js
import React from 'react';
import { Bot, User, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const ChatMessage = ({ message, isBot = false, timestamp, type = 'text', data = null }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderContent = () => {
    switch (type) {
      case 'product':
        return (
          <div className="bg-white rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex space-x-3">
              <img
                src={data.image}
                alt={data.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm line-clamp-2">
                  {data.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{data.categoryName}</div>
                {data.brand && (
                  <div className="text-xs text-gray-400 mt-0.5">{data.brand}</div>
                )}
                <div className="text-sm font-bold text-mixxo-pink-500 mt-1">
                  {formatPrice(data.price)}
                </div>
                {data.discount > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                    {data.discount}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>
        );

      case 'order':
        const statusIcons = {
          pending: <Clock className="w-4 h-4 text-yellow-500" />,
          confirmed: <CheckCircle className="w-4 h-4 text-blue-500" />,
          processing: <Package className="w-4 h-4 text-purple-500" />,
          shipped: <Package className="w-4 h-4 text-indigo-500" />,
          delivered: <CheckCircle className="w-4 h-4 text-green-500" />,
          cancelled: <XCircle className="w-4 h-4 text-red-500" />
        };

        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          confirmed: 'bg-blue-100 text-blue-800',
          processing: 'bg-purple-100 text-purple-800',
          shipped: 'bg-indigo-100 text-indigo-800',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800'
        };

        return (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-gray-900 text-sm">
                Pedido #{data.orderNumber || data.id}
              </div>
              <div className="flex items-center space-x-1">
                {statusIcons[data.status]}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[data.status]}`}>
                  {data.status}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              {data.itemCount || data.order_items?.length || 0} producto(s)
            </div>
            <div className="text-sm font-bold text-gray-900">
              Total: {formatPrice(data.total)}
            </div>
          </div>
        );

      default:
        return (
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message}
          </div>
        );
    }
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in`}>
      <div className={`flex items-end space-x-2 max-w-[85%] ${isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-gradient-mixxo shadow-md' : 'bg-gray-300'
        }`}>
          {isBot ? (
            <Bot className="w-5 h-5 text-white" />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
        </div>

        {/* Message bubble */}
        <div className={`${
          isBot 
            ? 'bg-white border border-gray-200 text-gray-900' 
            : 'bg-gradient-mixxo text-white'
        } rounded-2xl px-4 py-3 shadow-sm`}>
          {renderContent()}
          
          {timestamp && (
            <div className={`text-xs mt-1 ${isBot ? 'text-gray-400' : 'text-white/70'}`}>
              {formatTime(timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;