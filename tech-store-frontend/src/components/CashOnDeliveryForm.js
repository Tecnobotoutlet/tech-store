// src/components/CashOnDeliveryForm.js
import React from 'react';
import { Truck, MapPin, AlertCircle, CheckCircle, Package } from 'lucide-react';

const CashOnDeliveryForm = ({ 
  onSubmit, 
  isProcessing, 
  shippingCity,
  isEligibleCity 
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEligibleCity) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Verificación de cobertura */}
      {isEligibleCity ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 text-lg mb-2">
                ¡Pago contra entrega disponible!
              </h4>
              <p className="text-green-700 mb-3">
                Tu dirección en <strong>{shippingCity}</strong> califica para pago contra entrega.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    Ciudad: <strong>{shippingCity}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    Cobertura: Zona urbana principal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 text-lg mb-2">
                Pago contra entrega no disponible
              </h4>
              <p className="text-red-700 mb-3">
                Tu ciudad <strong>{shippingCity || '(no especificada)'}</strong> no está en nuestra zona de cobertura para pago contra entrega.
              </p>
              <div className="bg-white rounded-lg p-4 text-sm">
                <p className="text-gray-700 mb-2">
                  <strong>Este servicio está disponible solo en:</strong>
                </p>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• Ciudades principales de Colombia</li>
                  <li>• Zonas urbanas (no veredas ni corregimientos)</li>
                  <li>• Áreas con cobertura de mensajería express</li>
                </ul>
                <p className="text-blue-600 mt-3 font-medium">
                  💳 Por favor selecciona otro método de pago disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información del servicio */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          ¿Cómo funciona el pago contra entrega?
        </h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
              1
            </div>
            <p>Confirma tu pedido ahora mismo sin pagar</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
              2
            </div>
            <p>Preparamos y enviamos tu pedido a tu dirección</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
              3
            </div>
            <p>Pagas en efectivo al recibir tu pedido (sin recargos)</p>
          </div>
        </div>
      </div>

      {/* Condiciones importantes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Importante
        </h5>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>✓ Ten el valor exacto disponible al momento de la entrega</li>
          <li>✓ Verifica tu pedido antes de pagar al mensajero</li>
          <li>✓ Entrega en 2-4 días hábiles según tu ciudad</li>
          <li>✓ Solo se acepta efectivo (no transferencias en el momento)</li>
        </ul>
      </div>

      {/* Ciudades con cobertura */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">
          Ciudades con pago contra entrega disponible:
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Bogotá D.C.</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Medellín</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Cali</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Barranquilla</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Cartagena</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Bucaramanga</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Cúcuta</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Pereira</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Santa Marta</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Ibagué</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Villavicencio</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Manizales</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          * Solo aplica para zonas urbanas principales, no incluye veredas ni corregimientos
        </p>
      </div>

      {/* Botón de confirmación */}
      <button
        type="submit"
        disabled={isProcessing || !isEligibleCity}
        className={`w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
          isEligibleCity
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } disabled:opacity-50`}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Procesando pedido...</span>
          </>
        ) : isEligibleCity ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Confirmar pedido (Pago al recibir)</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5" />
            <span>No disponible en tu ciudad</span>
          </>
        )}
      </button>
    </form>
  );
};

export default CashOnDeliveryForm;