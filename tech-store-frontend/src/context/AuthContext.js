// src/context/AuthContext.js - CON REFRESH USER
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService, getAuthToken, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState('login');
  const [notification, setNotification] = useState(null);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const showNotification = useCallback((message, type = 'success', duration = 5000) => {
    setNotification({ message, type });
    const timeoutId = setTimeout(() => setNotification(null), duration);
    return () => clearTimeout(timeoutId);
  }, []);

  // 🆕 FUNCIÓN PARA REFRESCAR DATOS DEL USUARIO
  const refreshUser = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        clearAuthData();
        return { success: false, error: 'No hay sesión activa' };
      }

      // Obtener datos actualizados del usuario
      const result = await authService.verifyToken(token);
      
      // Actualizar localStorage y estado
      localStorage.setItem('userData', JSON.stringify(result.user));
      setUser(result.user);
      
      console.log('✅ Datos del usuario actualizados:', result.user);
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      clearAuthData();
      return { success: false, error: error.message };
    }
  }, [clearAuthData]);

  const logout = useCallback(() => {
    clearAuthData();
    setAuthModalOpen(false);
    showNotification('Sesión cerrada correctamente', 'info');
  }, [clearAuthData, showNotification]);

  // Verificación inicial de autenticación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();
        const userData = getCurrentUser();
        
        if (token && userData) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (payload.exp > currentTime) {
              // 🔄 Siempre verificar con el servidor para obtener datos actualizados
              const result = await authService.verifyToken(token);
              setUser(result.user);
              setIsAuthenticated(true);
              
              // Actualizar localStorage con datos frescos
              localStorage.setItem('userData', JSON.stringify(result.user));
            } else {
              clearAuthData();
            }
          } catch (tokenError) {
            clearAuthData();
          }
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.warn('Error al verificar autenticación inicial:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [clearAuthData]);

  // 🆕 Listener para refrescar usuario desde otros componentes
  useEffect(() => {
    const handleRefreshUser = async () => {
      await refreshUser();
    };

    window.addEventListener('auth:refresh', handleRefreshUser);
    return () => window.removeEventListener('auth:refresh', handleRefreshUser);
  }, [refreshUser]);

  // Listener para logout automático
  useEffect(() => {
    const handleAutoLogout = () => {
      logout();
    };

    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, [logout]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(email, password);
      
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
      
      console.log('Usuario logueado:', result.user);
      
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      
      showNotification(`¡Bienvenido ${result.user.firstName}!`, 'success');
      
      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error.message || 'Error en el login';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.register(userData);
      
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
      
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      
      showNotification(`¡Bienvenido ${result.user.firstName}! Tu cuenta ha sido creada.`, 'success');
      
      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error.message || 'Error en el registro';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const updateProfile = useCallback(async (updateData) => {
    if (!user || !isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      const result = await authService.updateProfile(user.id, updateData, token);
      
      setUser(result.user);
      localStorage.setItem('userData', JSON.stringify(result.user));
      
      showNotification('Perfil actualizado correctamente', 'success');
      
      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error.message || 'Error al actualizar perfil';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, showNotification]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!user || !isAuthenticated) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = getAuthToken();
      await authService.changePassword(user.id, currentPassword, newPassword, token);
      
      showNotification('Contraseña actualizada correctamente', 'success');
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Error al cambiar contraseña';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, showNotification]);

  const getUserStats = useCallback(async () => {
    if (!user || !isAuthenticated) {
      return null;
    }

    try {
      const token = getAuthToken();
      const stats = await authService.getUserStats(user.id, token);
      return stats;
    } catch (error) {
      console.warn('Error al obtener estadísticas:', error);
      return null;
    }
  }, [user, isAuthenticated]);

  const forgotPassword = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.forgotPassword(email);
      showNotification(result.message, 'success');
      return { success: true };
    } catch (error) {
      const errorMessage = error.message || 'Error al recuperar contraseña';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const openLoginModal = useCallback(() => {
    setAuthModalType('login');
    setAuthModalOpen(true);
    setError(null);
  }, []);

  const openRegisterModal = useCallback(() => {
    setAuthModalType('register');
    setAuthModalOpen(true);
    setError(null);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setError(null);
  }, []);

  const switchToLogin = useCallback(() => {
    setAuthModalType('login');
    setError(null);
  }, []);

  const switchToRegister = useCallback(() => {
    setAuthModalType('register');
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const requireAuth = useCallback((callback) => {
    if (!isAuthenticated) {
      openLoginModal();
      return false;
    }
    if (callback) callback();
    return true;
  }, [isAuthenticated, openLoginModal]);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    error,
    notification,
    isAdmin,
    authModalOpen,
    authModalType,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getUserStats,
    forgotPassword,
    refreshUser, // 🆕 Nueva función
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
    switchToLogin,
    switchToRegister,
    clearError,
    requireAuth,
    showNotification
  }), [
    user,
    isAuthenticated,
    loading,
    error,
    notification,
    isAdmin,
    authModalOpen,
    authModalType,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getUserStats,
    forgotPassword,
    refreshUser, // 🆕 Nueva función
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
    switchToLogin,
    switchToRegister,
    clearError,
    requireAuth,
    showNotification
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading, openLoginModal } = useAuth();
    
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
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
              Necesitas iniciar sesión para acceder a esta sección.
            </p>
            <button 
              onClick={openLoginModal}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};
