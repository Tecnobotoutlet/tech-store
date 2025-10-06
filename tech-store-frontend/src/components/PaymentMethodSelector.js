// src/components/PaymentMethodSelector.js
import React from 'react';
import { CreditCard, Smartphone, Building2, Banknote, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onMethodChange,
  isEligibleForCOD = false,
  shippingCity = ''
}) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
      color: 'blue',
      popular: true,
      available: true
    },
    {
      id: 'nequi',
      name: 'Nequi',
      icon: Smartphone,
      description: 'Pago desde tu app Nequi',
      color: 'purple',
      popular: true,
      available: true
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: Building2,
      description: 'Pago desde tu banco',
      color: 'green',
      popular: false,
      available: true
    },
    {
      id: 'cash_on_delivery',
      name: 'Pago Contra Entrega',
      icon: Banknote,
      description: isEligibleForCOD 
        ? `Disponible en ${shippingCity}`
        : 'No disponible en tu ciudad',
      color: 'orange',
      popular: false,
      available: isEligibleForCOD
    }
  ];

  const getColorClasses = (color, isSelected, available) => {
    const baseColors = {
      blue: {
        border: isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700'
      },
      purple: {
        border: isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700'
      },
      green: {
        border: isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
        icon: 'text-green-600',
        badge: 'bg-green-100 text-green-700'
      },
      orange: {
        border: isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300',
        icon: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-700'
      }
    };
    
    if (!available) {
      return {
        border: 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed',
        icon: 'text-gray-400',
        badge: 'bg-gray-100 text-gray-500'
      };
    }
    
    return baseColors[color];
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Selecciona tu método de pago
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          const colors = getColorClasses(method.color, isSelected, method.available);

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => method.available && onMethodChange(method.id)}
              disabled={!method.available}
              className={`
                relative p-4 border-2 rounded-xl transition-all
                ${colors.border}
                ${isSelected && method.available ? 'shadow-lg' : method.available ? 'hover:shadow-md' : ''}
                text-left w-full
              `}
            >
              {/* Badge "Popular" */}
              {method.popular && method.available && (
                <div className="absolute -top-2 -right-2">
                  <span className={`
                    px-3 py-1 text-xs font-semibold rounded-full
                    ${colors.badge}
                  `}>
                    Popular
                  </span>
                </div>
              )}

              {/* Badge "No disponible" */}
              {!method.available && (
                <div className="absolute -top-2 -right-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>No disponible</span>
                  </span>
                </div>
              )}

              {/* Checkmark si está seleccionado */}
              {isSelected && method.available && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Icono */}
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${isSelected && method.available ? 'bg-white shadow-sm' : 'bg-gray-50'}
                `}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${method.available ? 'text-gray-900' : 'text-gray-500'}`}>
                    {method.name}
                  </h4>
                  <p className={`text-sm ${method.available ? 'text-gray-600' : 'text-gray-400'}`}>
                    {method.description}
                  </p>
                  
                  {/* Mensaje adicional para COD */}
                  {method.id === 'cash_on_delivery' && !method.available && (
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Solo en ciudades principales
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Información adicional sobre contra entrega */}
      {!isEligibleForCOD && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-900 font-medium mb-1">
                Pago contra entrega no disponible
              </p>
              <p className="text-amber-700">
                Este método solo está disponible en ciudades principales como Bogotá, Medellín, Cali, Barranquilla, etc.
                {shippingCity && ` Tu ciudad actual es ${shippingCity}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Información de seguridad */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h5 className="font-medium text-gray-900">Pago 100% seguro</h5>
            <p className="text-sm text-gray-600">
              Todas las transacciones están protegidas con encriptación SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
