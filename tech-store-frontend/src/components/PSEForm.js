// src/components/PSEForm.js
import React, { useState, useEffect } from 'react';
import { Building2, Lock, AlertCircle, Loader } from 'lucide-react';
import wompiService from '../services/wompiService';

const PSEForm = ({ onSubmit, isProcessing, customerData }) => {
  const [formData, setFormData] = useState({
    bankCode: '',
    userType: '0', // 0 = Persona, 1 = Empresa
    documentType: customerData?.documentType || 'CC',
    document: customerData?.document || ''
  });
  
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      setLoadingBanks(true);
      const banksData = await wompiService.getPSEBanks();
      setBanks(banksData);
    } catch (error) {
      console.error('Error loading banks:', error);
      // Usar bancos por defecto si falla
      setBanks(wompiService.getDefaultPSEBanks());
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bankCode) {
      newErrors.bankCode = 'Selecciona tu banco';
    }

    if (!formData.document) {
      newErrors.document = 'El documento es requerido';
    } else if (formData.document.length < 6) {
      newErrors.document = 'Documento inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit({
      bankCode: formData.bankCode,
      userType: parseInt(formData.userType),
      documentType: formData.documentType,
      document: formData.document
    });
  };

  const documentTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'NIT', label: 'NIT' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'PP', label: 'Pasaporte' },
    { value: 'IDC', label: 'Identificador Único de Cliente' },
    { value: 'CEL', label: 'Línea Celular' },
    { value: 'RC', label: 'Registro Civil' },
    { value: 'DE', label: 'Documento de Extranjería' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header con branding PSE */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Pagar con PSE</h3>
            <p className="text-green-100 text-sm">
              Débito directo desde tu cuenta bancaria
            </p>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-3">¿Cómo funciona?</h4>
        <ol className="space-y-2 text-sm text-green-800">
          <li className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <span>Selecciona tu banco</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <span>Serás redirigido al sitio web de tu banco</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <span>Ingresa con tus credenciales bancarias</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <span>Autoriza el pago y recibirás confirmación</span>
          </li>
        </ol>
      </div>

      {/* Tipo de persona */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de persona *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange({ target: { name: 'userType', value: '0' } })}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${formData.userType === '0' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-300 hover:border-green-300'
              }
            `}
          >
            <div className="text-center">
              <div className="font-semibold">Persona Natural</div>
              <div className="text-sm text-gray-600">Para individuos</div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => handleInputChange({ target: { name: 'userType', value: '1' } })}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${formData.userType === '1' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-300 hover:border-green-300'
              }
            `}
          >
            <div className="text-center">
              <div className="font-semibold">Empresa</div>
              <div className="text-sm text-gray-600">Para negocios</div>
            </div>
          </button>
        </div>
      </div>

      {/* Seleccionar banco */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona tu banco *
        </label>
        {loadingBanks ? (
          <div className="flex items-center justify-center py-4 border border-gray-300 rounded-lg">
            <Loader className="w-5 h-5 animate-spin text-gray-400 mr-2" />
            <span className="text-gray-600">Cargando bancos...</span>
          </div>
        ) : (
          <select
            name="bankCode"
            value={formData.bankCode}
            onChange={handleInputChange}
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              ${errors.bankCode ? 'border-red-500' : 'border-gray-300'}
            `}
          >
            <option value="">Selecciona tu banco</option>
            {banks.map((bank) => (
              <option 
                key={bank.financial_institution_code} 
                value={bank.financial_institution_code}
              >
                {bank.financial_institution_name}
              </option>
            ))}
          </select>
        )}
        {errors.bankCode && (
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.bankCode}
          </p>
        )}
      </div>

      {/* Tipo de documento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de documento *
          </label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de documento *
          </label>
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            placeholder="1234567890"
            className={`
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-green-500 focus:border-transparent
              ${errors.document ? 'border-red-500' : 'border-gray-300'}
            `}
          />
          {errors.document && (
            <p className="text-red-500 text-sm mt-1">{errors.document}</p>
          )}
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-yellow-900 mb-1">Importante</h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Asegúrate de tener saldo disponible en tu cuenta</li>
              <li>• Ten a la mano tus claves del banco</li>
              <li>• El pago puede tardar hasta 24 horas en procesarse</li>
              <li>• No cierres la ventana hasta completar el proceso</li>
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
              Serás redirigido al sitio oficial de tu banco
            </p>
          </div>
        </div>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isProcessing || !formData.bankCode || !formData.document}
        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2 transition-all"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <Building2 className="w-5 h-5" />
            <span>Continuar a mi banco</span>
          </>
        )}
      </button>

      {/* Nota legal */}
      <p className="text-xs text-gray-500 text-center">
        Al continuar serás redirigido al sitio web seguro de tu banco
      </p>
    </form>
  );
};

export default PSEForm;