// src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CreditCardForm from './CreditCardForm';
// Corregido: importación del servicio wompi
import wompiService from '../services/wompiService';
import { 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

const Checkout = ({ onBack, onPaymentSuccess, onPaymentError }) => {
  // Hooks seguros con nuevo sistema de autenticación
  const cartContext = useCart();
  const authContext = useAuth();
  
  // Manejo seguro del contexto del carrito
  const items = cartContext?.items || cartContext?.cartItems || [];
  const total = cartContext?.total || 0;
  const clearCart = cartContext?.clearCart || (() => {});
  
  // Manejo seguro del contexto de autenticación - usando el nuevo sistema
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const openLoginModal = authContext?.openLoginModal || (() => {});
  const openRegisterModal = authContext?.openRegisterModal || (() => {});
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos personales
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    document: '',
    documentType: 'CC',
    
    // Dirección de envío
    address: '',
    city: 'Bogotá',
    department: 'Bogotá D.C.',
    postalCode: '',
    neighborhood: '',
    addressDetails: '',
    
    // Método de pago
    paymentMethod: 'card',
    
    // Términos y condiciones
    acceptTerms: false,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: datos, 2: envío, 3: pago
  const [cardData, setCardData] = useState(null);
  
  // Estados para autenticación
  const [showGuestCheckoutPrompt, setShowGuestCheckoutPrompt] = useState(!isAuthenticated);

  // Prellenar datos si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
      setShowGuestCheckoutPrompt(false);
    }
  }, [isAuthenticated, user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validar datos personales
      if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
      if (!formData.email.trim()) newErrors.email = 'El email es requerido';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      if (!formData.document.trim()) newErrors.document = 'El documento es requerido';
    }

    if (step === 2) {
      // Validar dirección
      if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
      if (!formData.city.trim()) newErrors.city = 'La ciudad es requerida';
      if (!formData.department.trim()) newErrors.department = 'El departamento es requerido';
      if (!formData.neighborhood.trim()) newErrors.neighborhood = 'El barrio es requerido';
    }

    if (step === 3) {
      // Validar términos
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCardTokenize = async (cardTokenData) => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    setCardData(cardTokenData);

    try {
      // Preparar datos para Wompi
      const paymentData = {
        cardData: cardTokenData,
        amount: total,
        currency: 'COP',
        customerData: formData,
        shippingAddress: formData,
        items: items
      };

      console.log('Processing payment with data:', paymentData);

      // Procesar pago con Wompi
      let result;
      if (process.env.NODE_ENV === 'development') {
        // En desarrollo, usar tarjetas de prueba
        result = await wompiService.processTestPayment(paymentData);
      } else {
        // En producción, usar proceso real
        result = await wompiService.processPayment(paymentData);
      }

      console.log('Payment result:', result);

      if (result.success && result.status === 'APPROVED') {
        // Limpiar carrito y redirigir al éxito
        clearCart();
        onPaymentSuccess({
          reference: result.reference,
          transactionId: result.transactionId,
          amount: total,
          items: items,
          customerData: formData
        });
      } else {
        // Manejar error de pago
        onPaymentError({
          error: result.error || 'Pago rechazado',
          reference: result.reference,
          status: result.status
        });
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      onPaymentError({
        error: error.message || 'Error procesando el pago',
        reference: wompiService.generateReference ? wompiService.generateReference() : Date.now().toString()
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Prompt de autenticación para usuarios no autenticados
  const AuthPrompt = () => (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">¿Tienes cuenta?</h3>
            <p className="text-gray-600 text-sm">
              Inicia sesión para una experiencia más rápida y acceso a tu historial de pedidos
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={openLoginModal}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={openRegisterModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            Registrarse
          </button>
          <button
            onClick={() => setShowGuestCheckoutPrompt(false)}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continuar como Invitado
          </button>
        </div>
      </div>
    </div>
  );

  const renderPersonalDataStep = () => (
    <div className="space-y-6">
      {/* Prompt de autenticación para usuarios no autenticados */}
      {!isAuthenticated && showGuestCheckoutPrompt && <AuthPrompt />}
      
      {/* Mostrar información del usuario autenticado */}
      {isAuthenticated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 text-sm font-medium">
              Conectado como {user?.firstName} {user?.lastName}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Datos personales</h3>
          <p className="text-sm text-gray-600">Información para procesar tu pedido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombres *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            } ${isAuthenticated ? 'bg-gray-50' : ''}`}
            placeholder="Tu nombre"
            readOnly={isAuthenticated}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellidos *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            } ${isAuthenticated ? 'bg-gray-50' : ''}`}
            placeholder="Tu apellido"
            readOnly={isAuthenticated}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de documento
          </label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="CE">Cédula de Extranjería</option>
            <option value="NIT">NIT</option>
            <option value="PP">Pasaporte</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de documento *
          </label>
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.document ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123456789"
          />
          {errors.document && (
            <p className="text-red-500 text-sm mt-1">{errors.document}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } ${isAuthenticated ? 'bg-gray-50' : ''}`}
            placeholder="tu@email.com"
            readOnly={isAuthenticated}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="300 123 4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderShippingStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Dirección de envío</h3>
          <p className="text-sm text-gray-600">¿Dónde quieres recibir tu pedido?</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dirección completa *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Calle 123 # 45-67"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ciudad *
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Barranquilla">Barranquilla</option>
            <option value="Cartagena">Cartagena</option>
            <option value="Bucaramanga">Bucaramanga</option>
            <option value="Pereira">Pereira</option>
            <option value="Manizales">Manizales</option>
          </select>
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departamento *
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Bogotá D.C."
          />
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código postal
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="110111"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Barrio *
        </label>
        <input
          type="text"
          name="neighborhood"
          value={formData.neighborhood}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.neighborhood ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Chapinero"
        />
        {errors.neighborhood && (
          <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detalles adicionales
        </label>
        <textarea
          name="addressDetails"
          value={formData.addressDetails}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Apartamento, casa, oficina, referencias..."
        />
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Método de pago</h3>
          <p className="text-sm text-gray-600">Finaliza tu compra de forma segura</p>
        </div>
      </div>

      {/* Resumen del pedido */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-4">Resumen del pedido</h4>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{item.name} x {item.quantity}</span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Método de pago */}
      <div className="space-y-4">
        <h4 className="font-semibold mb-4">Información de pago</h4>
        
        {/* Formulario de tarjeta */}
        <CreditCardForm 
          onCardTokenize={handleCardTokenize}
          isProcessing={isProcessing}
        />
      </div>

      {/* Términos y condiciones */}
      <div className="space-y-3">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleInputChange}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Acepto los <button type="button" className="text-blue-600 hover:underline">términos y condiciones</button> y la <button type="button" className="text-blue-600 hover:underline">política de privacidad</button> *
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-red-500 text-sm">{errors.acceptTerms}</p>
        )}

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="acceptMarketing"
            checked={formData.acceptMarketing}
            onChange={handleInputChange}
            className="mt-1"
          />
          <span className="text-sm text-gray-700">
            Quiero recibir ofertas y promociones por email
          </span>
        </label>
      </div>

      {/* Seguridad */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h5 className="font-medium text-blue-900">Compra 100% segura</h5>
            <p className="text-sm text-blue-700">
              Tus datos están protegidos con encriptación SSL de 256 bits
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al carrito</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              {currentStep === 1 && renderPersonalDataStep()}
              {currentStep === 2 && renderShippingStep()}
              {currentStep === 3 && renderPaymentStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1 || isProcessing}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                {currentStep < 3 && (
                  <button
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Tu pedido</h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-gray-600 text-sm">Cantidad: {item.quantity}</p>
                      <p className="font-semibold text-blue-600">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Beneficios</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Envío gratis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Garantía incluida</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Devolución gratis 30 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;