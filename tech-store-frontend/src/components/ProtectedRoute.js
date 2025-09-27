// src/components/ProtectedRoute.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  fallback = null, 
  requireAuth = true,
  requireAdmin = false,
  showLoader = true,
  redirectMessage = null
}) => {
  const { isAuthenticated, user, loading, openLoginModal } = useAuth();

  // Mostrar loader mientras se verifica la autenticación
  if (loading && showLoader) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated) {
    // Si hay un fallback personalizado, usarlo
    if (fallback) {
      return fallback;
    }

    // Fallback por defecto
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Restringido
          </h3>
          <p className="text-gray-600 mb-6">
            {redirectMessage || 'Necesitas iniciar sesión para acceder a esta sección.'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={openLoginModal}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => window.history.back()}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si requiere permisos de admin y no es admin
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso No Autorizado
          </h3>
          <p className="text-gray-600 mb-6">
            No tienes permisos suficientes para acceder a esta sección.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar los children
  return children;
};

// Componente específico para rutas de admin
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireAdmin={true} 
    redirectMessage="Esta sección es solo para administradores."
    {...props}
  >
    {children}
  </ProtectedRoute>
);

// Componente para rutas que requieren autenticación
export const AuthRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireAdmin={false}
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;