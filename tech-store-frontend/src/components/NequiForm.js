// src/components/NequiForm.js
import React, { useState } from 'react';
import { Smartphone, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const NequiForm = ({ onSubmit, isProcessing }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});

  const formatPhone = (value) => {
    // Remover todo excepto números
    const cleaned = value.replace(/\D/g, '');
    
    // Limitar a 10 dígitos
    const limited = cleaned.substring(0, 10);
    
    // Formatear: 3XX XXX XXXX
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhoneNumber(formatted);
    
    if (errors.phone) {
      setErrors({ ...errors, phone: null });
    }
  };

  const validatePhone = () => {
    const cleaned = phoneNumber.replace(/\s/g, '');
    
    if (!cleaned) {
      setErrors({ phone: 'El número de teléfono es requerido' });
      return false;
    }
    
    if (cleaned.length !== 10) {
      setErrors({ phone: 'Ingresa un número de 10 dígitos' });
      return false;
    }
    
    if (!cleaned.startsWith('3')) {
      setErrors({ phone: 'Los números celulares en Colombia inician con 3' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePhone()) {
      return;
    }

    const cleaned = phoneNumber.replace(/\s/g, '');
    onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header con branding de Nequi */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Pagar con Nequi</h3>
            <p className="text-purple-100 text-sm">
              Pago rápido y seguro desde tu celular
            </p>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-3">¿Cómo funciona?</h4>
        <ol className="space-y-2 text-sm text-purple-800">
          <li className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <span>Ingresa tu número de celular registrado en Nequi</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <span>Recibirás una notificación push en tu app Nequi</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <span>Aprueba el pago ingresando tu clave en la app</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <span>Recibirás confirmación inmediata de tu compra</span>
          </li>
        </ol>
      </div>

      {/* Campo de teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de celular Nequi *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Smartphone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="3XX XXX XXXX"
            maxLength="12"
            className={`
              w-full pl-12 pr-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-purple-500 focus:border-transparent
              ${errors.phone ? 'border-red-500' : 'border-gray-300'}
            `}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.phone}
          </p>
        )}
        {phoneNumber && !errors.phone && phoneNumber.replace(/\s/g, '').length === 10 && (
          <p className="text-green-600 text-sm mt-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Número válido
          </p>
        )}
      </div>

      {/* Información importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-yellow-900 mb-1">Importante</h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Asegúrate de tener saldo disponible en tu cuenta Nequi</li>
              <li>• Ten tu celular a la mano para aprobar la transacción</li>
              <li>• La notificación llega en segundos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Lock className="w-6 h-6 text-green-600" />
          <div>
            <h5 className="font-medium text-green-900">Pago 100% seguro</h5>
            <p className="text-sm text-green-700">
              Tu información financiera está protegida por Wompi y Nequi
            </p>
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isProcessing || !phoneNumber || phoneNumber.replace(/\s/g, '').length !== 10}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2 transition-all"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <Smartphone className="w-5 h-5" />
            <span>Continuar con Nequi</span>
          </>
        )}
      </button>

      {/* Nota legal */}
      <p className="text-xs text-gray-500 text-center">
        Al continuar serás redirigido a Nequi para completar el pago de forma segura
      </p>
    </form>
  );
};

export default NequiForm;