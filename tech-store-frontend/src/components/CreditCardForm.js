import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

const CreditCardForm = ({ onCardTokenize, isProcessing }) => {
  const [cardData, setCardData] = useState({
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
    card_holder: ''
  });
  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState('');

  // Detectar tipo de tarjeta
  const detectCardType = (number) => {
    const patterns = {
      visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
      mastercard: /^5[1-5][0-9]{14}$/,
      amex: /^3[47][0-9]{13}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
      diners: /^3[0689][0-9]{11}$/
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number.replace(/\s/g, ''))) {
        return type;
      }
    }
    return '';
  };

  // Formatear número de tarjeta
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'number':
        formattedValue = formatCardNumber(value);
        if (formattedValue.length >= 4) {
          setCardType(detectCardType(formattedValue));
        }
        break;
      case 'exp_month':
        formattedValue = value.replace(/[^0-9]/g, '').substring(0, 2);
        break;
      case 'exp_year':
        formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
        break;
      case 'cvc':
        formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
        break;
      case 'card_holder':
        formattedValue = value.toUpperCase();
        break;
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpiar errores
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateCard = () => {
    const newErrors = {};

    // Validar número
    const cleanNumber = cardData.number.replace(/\s/g, '');
    if (!cleanNumber || cleanNumber.length < 13) {
      newErrors.number = 'Número de tarjeta inválido';
    }

    // Validar mes
    const month = parseInt(cardData.exp_month);
    if (!month || month < 1 || month > 12) {
      newErrors.exp_month = 'Mes inválido';
    }

    // Validar año
    const year = parseInt(cardData.exp_year);
    const currentYear = new Date().getFullYear();
    if (!year || year < currentYear || year > currentYear + 10) {
      newErrors.exp_year = 'Año inválido';
    }

    // Validar CVC
    if (!cardData.cvc || cardData.cvc.length < 3) {
      newErrors.cvc = 'CVC inválido';
    }

    // Validar titular
    if (!cardData.card_holder.trim() || cardData.card_holder.length < 3) {
      newErrors.card_holder = 'Nombre del titular requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCard()) {
      return;
    }

    // Preparar datos para tokenización
    const tokenData = {
      number: cardData.number.replace(/\s/g, ''),
      exp_month: cardData.exp_month.padStart(2, '0'),
      exp_year: cardData.exp_year,
      cvc: cardData.cvc,
      card_holder: cardData.card_holder
    };

    await onCardTokenize(tokenData);
  };

  const getCardIcon = () => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      diners: '💳'
    };
    return icons[cardType] || '💳';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="text-2xl">{getCardIcon()}</div>
            <div className="text-right">
              <div className="text-sm opacity-75">VÁLIDA HASTA</div>
              <div className="text-lg">
                {cardData.exp_month || 'MM'}/{cardData.exp_year?.slice(-2) || 'AA'}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-xl font-mono tracking-wider">
              {cardData.number || '•••• •••• •••• ••••'}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-75 mb-1">TITULAR</div>
              <div className="text-sm font-semibold">
                {cardData.card_holder || 'NOMBRE APELLIDO'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-75 mb-1">CVC</div>
              <div className="text-sm font-mono">
                {'•'.repeat(cardData.cvc.length) || '•••'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full transform -translate-x-10 translate-y-10"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Número de tarjeta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de tarjeta *
          </label>
          <div className="relative">
            <input
              type="text"
              name="number"
              value={cardData.number}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 ${
                errors.number ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <CreditCard className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.number && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.number}
            </p>
          )}
        </div>

        {/* Fecha de vencimiento y CVC */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes *
            </label>
            <input
              type="text"
              name="exp_month"
              value={cardData.exp_month}
              onChange={handleInputChange}
              placeholder="MM"
              maxLength="2"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.exp_month ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.exp_month && (
              <p className="text-red-500 text-xs mt-1">{errors.exp_month}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año *
            </label>
            <input
              type="text"
              name="exp_year"
              value={cardData.exp_year}
              onChange={handleInputChange}
              placeholder="AAAA"
              maxLength="4"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.exp_year ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.exp_year && (
              <p className="text-red-500 text-xs mt-1">{errors.exp_year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVC *
            </label>
            <input
              type="text"
              name="cvc"
              value={cardData.cvc}
              onChange={handleInputChange}
              placeholder="123"
              maxLength="4"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.cvc ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cvc && (
              <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
            )}
          </div>
        </div>

        {/* Nombre del titular */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del titular *
          </label>
          <input
            type="text"
            name="card_holder"
            value={cardData.card_holder}
            onChange={handleInputChange}
            placeholder="JUAN PÉREZ"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.card_holder ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.card_holder && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.card_holder}
            </p>
          )}
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Lock className="w-6 h-6 text-green-600" />
          <div>
            <h5 className="font-medium text-green-900">Transacción segura</h5>
            <p className="text-sm text-green-700">
              Tus datos están protegidos con encriptación SSL de 256 bits
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de prueba para sandbox */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Tarjetas de prueba (Sandbox):</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Visa:</strong> 4242 4242 4242 4242</p>
          <p><strong>MasterCard:</strong> 5555 5555 5555 4444</p>
          <p><strong>Fecha:</strong> Cualquier fecha futura</p>
          <p><strong>CVC:</strong> Cualquier número de 3 dígitos</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando pago...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <span>Procesar pago seguro</span>
          </>
        )}
      </button>
    </form>
  );
};

export default CreditCardForm;