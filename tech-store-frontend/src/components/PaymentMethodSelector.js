// src/components/PaymentMethodSelector.js
import React from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de Crédito/Débito',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
      color: 'blue',
      popular: true
    },
    {
      id: 'nequi',
      name: 'Nequi',
      icon: Smartphone,
      description: 'Pago desde tu app Nequi',
      color: 'purple',
      popular: true
    },
    {
      id: 'pse',
      name: 'PSE',
      icon: Building2,
      description: 'Pago desde tu banco',
      color: 'green',
      popular: false
    },
    {
      id: 'bancolombia',
      name: 'Bancolombia',
      icon: Building2,
      description: 'Transferencia o QR',
      color: 'yellow',
      popular: false
    }
  ];

  const getColorClasses = (color, isSelected) => {
    const colors = {
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
      yellow: {
        border: isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300',
        icon: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-700'
      }
    };
    return colors[color];
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
          const colors = getColorClasses(method.color, isSelected);

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id)}
              className={`
                relative p-4 border-2 rounded-xl transition-all
                ${colors.border}
                ${isSelected ? 'shadow-lg' : 'hover:shadow-md'}
                text-left w-full
              `}
            >
              {/* Badge "Popular" */}
              {method.popular && (
                <div className="absolute -top-2 -right-2">
                  <span className={`
                    px-3 py-1 text-xs font-semibold rounded-full
                    ${colors.badge}
                  `}>
                    Popular
                  </span>
                </div>
              )}

              {/* Checkmark si está seleccionado */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                {/* Icono */}
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  ${isSelected ? 'bg-white shadow-sm' : 'bg-gray-50'}
                `}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {method.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

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