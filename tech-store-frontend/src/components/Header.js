// src/components/Header.js - Versión Mejorada y Funcional
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = ({ 
  onCartClick, 
  onSearch, 
  searchQuery, 
  onAdminClick,
  onCategoryClick,
  onOffersClick,
  onNewProductsClick,
  onBrandsClick,
  onSupportClick,
  onHomeClick,
  onProfileClick
}) => {
  const cartContext = useCart();
  const authContext = useAuth();
  
  const cartItems = cartContext?.cartItems || cartContext?.items || [];
  const isAuthenticated = authContext?.isAuthenticated || false;
  const user = authContext?.user || null;
  const isAdmin = authContext?.isAdmin || false;
  const logout = authContext?.logout || (() => {});
  const openLoginModal = authContext?.openLoginModal || (() => {});
  const openRegisterModal = authContext?.openRegisterModal || (() => {});
  const requireAuth = authContext?.requireAuth || ((callback) => callback && callback());

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const userMenuRef = useRef(null);
  const categoriesMenuRef = useRef(null);

  // Cerrar menús al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target)) {
        setShowCategoriesMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setShowMobileMenu(false);
        setShowCategoriesMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const totalItems = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  const handleCartClick = () => {
    requireAuth(() => {
      if (onCartClick) onCartClick();
    });
  };

  const handleAdminPanelClick = () => {
    if (!isAdmin) {
      alert('No tienes permisos de administrador');
      return;
    }
    setShowUserMenu(false);
    setShowMobileMenu(false);
    if (onAdminClick) {
      onAdminClick();
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  const handleMyProfile = () => {
  setShowUserMenu(false);
  setShowMobileMenu(false);
  if (onProfileClick) {
    onProfileClick();
  }
};

  const handleMyOrders = () => {
  setShowUserMenu(false);
  setShowMobileMenu(false);
  if (onProfileClick) {
    onProfileClick(); // Abre el perfil y el usuario puede ir a la pestaña de pedidos
  }
};

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Categorías principales
  const mainCategories = [
    { name: 'Tecnología', subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Gaming', 'Audio'] },
    { name: 'Hogar', subcategories: ['Electrodomésticos', 'Muebles', 'Decoración', 'Cocina'] },
    { name: 'Deportes', subcategories: ['Fitness', 'Fútbol', 'Basketball', 'Ciclismo', 'Natación'] },
    { name: 'Moda', subcategories: ['Hombre', 'Mujer', 'Niños', 'Zapatos', 'Accesorios'] },
    { name: 'Libros', subcategories: ['Ficción', 'No Ficción', 'Educativos', 'Comics'] },
    { name: 'Salud', subcategories: ['Vitaminas', 'Belleza', 'Cuidado Personal', 'Equipos'] }
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Principal */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={onHomeClick}
              className="flex-shrink-0 focus:outline-none"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                TechStore
              </h1>
            </button>
          </div>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'transform scale-105' : ''
            }`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-2 border-2 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition-all duration-300 ${
                  isSearchFocused 
                    ? 'border-blue-500 shadow-lg bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Buscar productos..."
                value={searchQuery || ''}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Acciones del usuario - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Carrito */}
            <button
              onClick={handleCartClick}
              className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 group"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Botón Admin (Solo si es admin) */}
            {isAdmin && (
              <button
                onClick={handleAdminPanelClick}
                className="relative p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 group"
                title="Panel de Administración"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}

            {/* Usuario autenticado */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 p-2 rounded-xl hover:bg-blue-50 group"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-semibold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </p>
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {getInitials(user?.firstName, user?.lastName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.firstName || ''} {user?.lastName || ''}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email || ''}</p>
                          {user?.role === 'admin' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                              Administrador
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={handleMyProfile}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Perfil
                      </button>
                      
                      <button
                        onClick={handleMyOrders}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Mis Pedidos
                      </button>

                      <button
                        onClick={() => {
                          handleCartClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                        Mi Carrito
                        {totalItems > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {totalItems}
                          </span>
                        )}
                      </button>
                      
                      {isAdmin && (
                        <>
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={handleAdminPanelClick}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                          >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Panel de Admin
                          </button>
                        </>
                      )}
                      
                      <hr className="my-2 border-gray-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={openLoginModal}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={openRegisterModal}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Barra de búsqueda móvil */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar productos..."
              value={searchQuery || ''}
              onChange={(e) => onSearch && onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Menú móvil */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user?.firstName || ''} {user?.lastName || ''}
                    </p>
                    <p className="text-sm text-gray-500">{user?.email || ''}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleMyProfile}
                  className="w-full flex items-center py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mi Perfil
                </button>

                <button
                  onClick={handleMyOrders}
                  className="w-full flex items-center py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Mis Pedidos
                </button>

                {isAdmin && (
                  <button
                    onClick={handleAdminPanelClick}
                    className="w-full flex items-center py-2 text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Panel de Admin
                  </button>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center py-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    openLoginModal();
                    setShowMobileMenu(false);
                  }}
                  className="w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    openRegisterModal();
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium text-center"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        )}

        {/* Barra de Navegación Funcional */}
        <nav className="border-t border-gray-100 py-3 hidden md:block">
          <div className="flex items-center justify-center space-x-8">
            {/* Categorías con dropdown */}
            <div className="relative" ref={categoriesMenuRef}>
              <button 
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Categorías</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${showCategoriesMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown de categorías */}
              {showCategoriesMenu && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50">
                  <div className="grid grid-cols-2 gap-4 px-4">
                    {mainCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <button
                          onClick={() => {
                            onCategoryClick && onCategoryClick(category.name);
                            setShowCategoriesMenu(false);
                          }}
                          className="font-semibold text-gray-800 hover:text-blue-600 transition-colors text-left"
                        >
                          {category.name}
                        </button>
                        <ul className="space-y-1">
                          {category.subcategories.map((sub, subIndex) => (
                            <li key={subIndex}>
                              <button
                                onClick={() => {
                                  onCategoryClick && onCategoryClick(sub);
                                  setShowCategoriesMenu(false);
                                }}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors text-left"
                              >
                                {sub}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={onOffersClick}
              className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <span>🔥</span>
              <span>Ofertas</span>
            </button>
            
            <button 
              onClick={onNewProductsClick}
              className="text-gray-600 hover:text-green-600 font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <span>✨</span>
              <span>Nuevos Productos</span>
            </button>
            
            <button 
              onClick={onBrandsClick}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Marcas
            </button>
            
            <button 
              onClick={onSupportClick}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Soporte</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
