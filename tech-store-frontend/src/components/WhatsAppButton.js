// src/components/WhatsAppButton.js
import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';

const WhatsAppButton = ({ 
  phoneNumber = '573144505320', // Número con código de país (57 para Colombia)
  message = 'Hola! Tengo una consulta sobre un producto',
  position = 'right', // 'right' o 'left'
  showTooltip = true,
  companyName = 'MIXXO'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // Mostrar el botón después de un pequeño delay para mejor UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Quitar el efecto de pulso después de 5 segundos
    const pulseTimer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleWhatsAppClick = () => {
    // Formatear el número sin espacios ni caracteres especiales
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Detectar si es móvil o desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // URL diferente para móvil y desktop
    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
    
    // Abrir en nueva ventana
    window.open(whatsappUrl, '_blank');
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setShowPulse(false);
  };

  // Determinar la posición del botón
  const positionClasses = position === 'left' 
    ? 'left-6' 
    : 'right-6';

  const expandedPositionClasses = position === 'left'
    ? 'left-6'
    : 'right-6';

  if (!isVisible) return null;

  return (
    <>
      {/* Botón principal */}
      <div
        className={`fixed bottom-6 ${positionClasses} z-50 transition-all duration-300 ${
          isExpanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Tooltip */}
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

        {/* Efecto de pulso */}
        {showPulse && (
          <>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-50" />
          </>
        )}

        {/* Botón */}
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
        className={`fixed bottom-6 ${expandedPositionClasses} z-50 transition-all duration-300 ${
          isExpanded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center justify-between mb-3">
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
            <p className="text-sm text-green-50">
              Respuesta promedio: 5 minutos
            </p>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <p className="text-gray-700 text-sm">
                Hola! Estamos aquí para ayudarte con cualquier pregunta sobre nuestros productos.
              </p>
              <div className="mt-3 text-xs text-gray-500">
                Horario de atención: Lun-Vie 8:00-18:00
              </div>
            </div>

            {/* Botones de acción rápida */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => {
                  handleWhatsAppClick();
                }}
                className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 text-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Hacer una consulta</div>
                    <div className="text-xs text-gray-500">Sobre productos o pedidos</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  const trackingMessage = 'Hola! Quiero hacer seguimiento a mi pedido';
                  const cleanNumber = phoneNumber.replace(/\D/g, '');
                  const encodedMessage = encodeURIComponent(trackingMessage);
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  const url = isMobile
                    ? `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`
                    : `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMessage}`;
                  window.open(url, '_blank');
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

            {/* Botón principal de WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Iniciar chat en WhatsApp</span>
            </button>

            {/* Info adicional */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Al hacer clic, serás redirigido a WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop cuando está expandido */}
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