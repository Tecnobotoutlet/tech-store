// src/components/LoadingMixxo.js - Componente de carga personalizado
import React from 'react';

const LoadingMixxo = ({ fullScreen = false, message = "Cargando..." }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          {/* Logo animado */}
          <div className="mb-8 relative">
            <div className="text-6xl font-black text-gradient-mixxo animate-pulse">
              mixxo
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-mixxo rounded-full"></div>
          </div>

          {/* Spinner personalizado */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Círculos giratorios */}
            <div className="absolute inset-0 border-4 border-transparent border-t-mixxo-pink-500 border-r-mixxo-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-b-mixxo-cyan-500 border-l-mixxo-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
            <div className="absolute inset-4 border-4 border-transparent border-t-mixxo-pink-500 rounded-full animate-spin" style={{animationDuration: '0.8s'}}></div>
            
            {/* Centro brillante */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-mixxo rounded-full animate-pulse shadow-mixxo"></div>
            </div>
          </div>

          {/* Mensaje */}
          <p className="text-gray-600 font-semibold text-lg animate-pulse">{message}</p>
          
          {/* Puntos animados */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-mixxo-pink-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-mixxo-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-mixxo-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Loading inline
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinner pequeño */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-transparent border-t-mixxo-pink-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-b-mixxo-cyan-500 rounded-full animate-spin" style={{animationDirection: 'reverse'}}></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default LoadingMixxo;