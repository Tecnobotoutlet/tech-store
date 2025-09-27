// src/components/AuthModal.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const {
    authModalOpen,
    authModalType,
    closeAuthModal,
    switchToLogin,
    switchToRegister,
    login,
    register,
    forgotPassword,
    loading,
    error,
    clearError
  } = useAuth();

  // Estados del formulario
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Limpiar datos cuando se abre/cierra el modal
  useEffect(() => {
    if (authModalOpen) {
      clearError();
      setValidationErrors({});
      setShowForgotPassword(false);
      setLoginData({ email: '', password: '' });
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      });
      setForgotPasswordData({ email: '' });
    }
  }, [authModalOpen, clearError]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    
    if (authModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [authModalOpen, closeAuthModal]);

  // Calcular fuerza de contraseña
  useEffect(() => {
    const password = registerData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [registerData.password]);

  // Handlers de cambio
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordData(prev => ({ ...prev, email: e.target.value }));
  };

  // Validación de registro
  const validateRegister = () => {
    const errors = {};
    
    if (!registerData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }
    
    if (!registerData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }
    
    if (!registerData.email) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = 'El email no es válido';
    }
    
    if (!registerData.phone) {
      errors.phone = 'El teléfono es requerido';
    } else if (!/^[0-9+\-\s()]+$/.test(registerData.phone)) {
      errors.phone = 'El teléfono no es válido';
    }
    
    if (!registerData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (registerData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!registerData.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(loginData.email, loginData.password);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    
    const userData = {
      firstName: registerData.firstName.trim(),
      lastName: registerData.lastName.trim(),
      email: registerData.email.toLowerCase(),
      phone: registerData.phone,
      password: registerData.password
    };
    
    await register(userData);
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword(forgotPasswordData.email);
    if (result.success) {
      setShowForgotPassword(false);
      switchToLogin();
    }
  };

  // Utilidades de contraseña
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Débil';
    if (passwordStrength <= 2) return 'Regular';
    if (passwordStrength <= 3) return 'Buena';
    return 'Excelente';
  };

  if (!authModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {showForgotPassword ? 'Recuperar Contraseña' : 
                 authModalType === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-blue-100 mt-1">
                {showForgotPassword ? 'Te enviaremos instrucciones' :
                 authModalType === 'login' ? 'Accede a tu cuenta' : 'Únete a nuestra comunidad'}
              </p>
            </div>
            <button
              onClick={closeAuthModal}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Error general */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {authModalType === 'login' && !showForgotPassword && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>

              {/* Credenciales de prueba */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <strong className="text-blue-800">Credenciales de prueba:</strong><br/>
                <span className="text-blue-700">Email: admin@techstore.com</span><br/>
                <span className="text-blue-700">Contraseña: admin123</span>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {authModalType === 'register' && !showForgotPassword && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Nombres */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Juan"
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Pérez"
                  />
                  {validationErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email y Teléfono */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="juan@ejemplo.com"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+57 300 123 4567"
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Indicador de fuerza de contraseña */}
                {registerData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Fortaleza:</span>
                      <span className={`font-medium ${
                        passwordStrength <= 1 ? 'text-red-600' :
                        passwordStrength <= 2 ? 'text-yellow-600' :
                        passwordStrength <= 3 ? 'text-blue-600' :
                        'text-green-600'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="mt-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Términos y condiciones */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={registerData.acceptTerms}
                    onChange={handleRegisterChange}
                    className={`mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                      validationErrors.acceptTerms ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    Acepto los{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-medium">
                      términos y condiciones
                    </button>
                    {' '}y la{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-medium">
                      política de privacidad
                    </button>
                  </span>
                </label>
                {validationErrors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.acceptTerms}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {showForgotPassword && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={forgotPasswordData.email}
                  onChange={handleForgotPasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!showForgotPassword && (
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl text-center">
            <p className="text-sm text-gray-600">
              {authModalType === 'login' ? (
                <>
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={switchToRegister}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Regístrate aquí
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    onClick={switchToLogin}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Inicia sesión aquí
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;