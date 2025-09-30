// src/components/PaymentResult.js - Actualizado con integración Wompi
import React, { useState, useEffect } from 'react';

import wompiService from '../services/wompiService';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download, 
  Mail, 
  Package,
  ArrowRight,
  Home,
  ShoppingBag,
  Copy,
  Check,
  Loader
} from 'lucide-react';

const PaymentResult = ({ 
  paymentData: propPaymentData, 
  onBackToHome, 
  onViewOrder, 
  type: propType
}) => {
 
  
  // Estados
  const [status, setStatus] = useState(propType || 'loading');
  const [paymentData, setPaymentData] = useState(propPaymentData || null);
  const [transactionData, setTransactionData] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Obtener parámetros de la URL
  const success = searchParams.get('success');
  const pending = searchParams.get('pending');
  const reference = searchParams.get('reference');
  const transactionId = searchParams.get('id');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Si viene de props, usar esos datos
    if (propType && propPaymentData) {
      setStatus(propType);
      setPaymentData(propPaymentData);
      if (propType === 'success') {
        setTimeout(() => setEmailSent(true), 2000);
      }
      return;
    }

    // Si viene de URL, verificar el estado
    if (transactionId) {
      checkTransactionStatus(transactionId);
    } else if (success === 'true') {
      setStatus('success');
      setTimeout(() => setEmailSent(true), 2000);
    } else if (pending === 'true') {
      setStatus('pending');
    } else if (searchParams.get('error')) {
      setStatus('error');
    }
  }, [propType, propPaymentData, transactionId, success, pending]);

  const checkTransactionStatus = async (txId) => {
    try {
      const result = await wompiService.getTransactionStatus(txId);
      setTransactionData(result);
      
      const statusMap = {
        'APPROVED': 'success',
        'PENDING': 'pending',
        'DECLINED': 'error',
        'VOIDED': 'error',
        'ERROR': 'error'
      };
      
      setStatus(statusMap[result.status] || 'pending');
      
      if (statusMap[result.status] === 'success') {
        setTimeout(() => setEmailSent(true), 2000);
      }
    } catch (error) {
      console.error('Error checking transaction:', error);
      setStatus('error');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } 
  };

  const handleViewOrder = () => {
    if (onViewOrder) {
      onViewOrder();
    } 
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: '¡Pago exitoso!',
          subtitle: 'Tu pedido ha sido procesado correctamente',
          description: 'Recibirás un email de confirmación con todos los detalles de tu compra.'
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Error en el pago',
          subtitle: 'No pudimos procesar tu pago',
          description: 'Por favor, verifica tus datos de pago e inténtalo nuevamente.'
        };
      case 'pending':
        return {
          icon: Clock,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Pago en proceso',
          subtitle: 'Tu pago está siendo verificado',
          description: 'Te notificaremos por email cuando el pago sea confirmado.'
        };
      case 'loading':
        return {
          icon: Loader,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Verificando pago',
          subtitle: 'Estamos confirmando tu transacción',
          description: 'Por favor espera un momento...'
        };
      default:
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: '¡Pago exitoso!',
          subtitle: 'Tu pedido ha sido procesado correctamente',
          description: 'Recibirás un email de confirmación con todos los detalles de tu compra.'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const IconComponent = statusConfig.icon;

  // Determinar la referencia a mostrar
  const displayReference = reference || 
                          paymentData?.reference || 
                          transactionData?.reference ||
                          orderId;

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-8 text-center`}>
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusConfig.title}</h1>
              <p className="text-xl text-gray-700 mb-4">{statusConfig.subtitle}</p>
              <p className="text-gray-600">{statusConfig.description}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state with full details
  if (status === 'success' && paymentData?.items) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-8 mb-8 text-center`}>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <IconComponent className={`w-10 h-10 ${statusConfig.iconColor}`} />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusConfig.title}</h1>
              <p className="text-xl text-gray-700 mb-4">{statusConfig.subtitle}</p>
              <p className="text-gray-600">{statusConfig.description}</p>
              
              {/* Order Reference */}
              {displayReference && (
                <div className="mt-6 bg-white rounded-lg p-4 inline-block">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {orderId ? 'Número de pedido:' : 'Referencia:'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-lg text-blue-600">
                        {displayReference}
                      </span>
                      <button
                        onClick={() => copyToClipboard(displayReference)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copiar número de pedido"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6">Detalles del pedido</h2>
                  <div className="space-y-4">
                    {paymentData.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-600">Cantidad: {item.quantity}</p>
                          <p className="font-semibold text-blue-600">{formatPrice(item.price)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mt-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total pagado:</span>
                      <span className="text-green-600">{formatPrice(paymentData.amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                {paymentData.customerData && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Información de envío</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Entregar a:</h3>
                        <p className="text-gray-700">
                          {paymentData.customerData.firstName} {paymentData.customerData.lastName}
                        </p>
                        <p className="text-gray-600">{paymentData.customerData.email}</p>
                        <p className="text-gray-600">{paymentData.customerData.phone}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Dirección:</h3>
                        <p className="text-gray-700">{paymentData.customerData.address}</p>
                        <p className="text-gray-700">
                          {paymentData.customerData.neighborhood}, {paymentData.customerData.city}
                        </p>
                        <p className="text-gray-700">{paymentData.customerData.department}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-blue-900">Tiempo de entrega estimado</h4>
                          <p className="text-blue-700">2-3 días hábiles</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Email Status */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold">Confirmación por email</h3>
                  </div>
                  {emailSent ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm">Email enviado correctamente</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm">Enviando confirmación...</span>
                    </div>
                  )}
                  {paymentData.customerData?.email && (
                    <p className="text-gray-600 text-sm mt-2">
                      Se envió una copia a: {paymentData.customerData.email}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-4">¿Qué sigue?</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleViewOrder}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Package className="w-5 h-5" />
                      <span>Seguir mi pedido</span>
                    </button>
                    
                    <button className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <Download className="w-5 h-5" />
                      <span>Descargar factura</span>
                    </button>
                    
                    <button
                      onClick={handleBackToHome}
                      className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Seguir comprando</span>
                    </button>
                  </div>
                </div>

                {/* Support */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="font-semibold mb-4">¿Necesitas ayuda?</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-gray-600">
                      Si tienes preguntas sobre tu pedido, contáctanos:
                    </p>
                    <div className="space-y-2">
                      <p className="flex items-center space-x-2">
                        <span>📞</span>
                        <span>+57 300 123 4567</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span>📧</span>
                        <span>soporte@techstore.com</span>
                      </p>
                      <p className="flex items-center space-x-2">
                        <span>💬</span>
                        <span>Chat en vivo 9AM - 6PM</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simplified view for error/pending/success without full data
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-8 text-center`}>
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}>
                <IconComponent className={`w-10 h-10 ${statusConfig.iconColor}`} />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{statusConfig.title}</h1>
            <p className="text-xl text-gray-700 mb-4">{statusConfig.subtitle}</p>
            <p className="text-gray-600 mb-8">{statusConfig.description}</p>

            {displayReference && (
              <div className="bg-white rounded-lg p-4 mb-8 inline-block">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {orderId ? 'Número de pedido:' : 'Referencia:'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-lg text-blue-600">
                      {displayReference}
                    </span>
                    <button
                      onClick={() => copyToClipboard(displayReference)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {status === 'error' ? (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/cart')}
                    className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Intentar nuevamente
                  </button>
                  <div>
                    <button
                      onClick={handleBackToHome}
                      className="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Home className="w-5 h-5" />
                      <span>Volver al inicio</span>
                    </button>
                  </div>
                </div>
              ) : status === 'success' ? (
                <div className="space-y-3">
                  <button
                    onClick={handleViewOrder}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Package className="w-5 h-5" />
                    <span>Ver mi pedido</span>
                  </button>
                  <button
                    onClick={handleBackToHome}
                    className="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Home className="w-5 h-5" />
                    <span>Volver al inicio</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Te notificaremos por email cuando tengamos una actualización
                  </p>
                  <button
                    onClick={handleBackToHome}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <Home className="w-5 h-5" />
                    <span>Volver al inicio</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
