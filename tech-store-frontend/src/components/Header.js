// src/components/Header.js - Versión mixxo moderna
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCategories } from '../context/CategoryContext';
import MetaPixel from '../services/MetaPixel';

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
  const { categories, loading: loadingCategories } = useCategories();
  
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

  const mainCategories = useMemo(() => {
    return Object.values(categories).map(category => ({
      name: category.name,
      icon: category.icon,
      slug: category.slug,
      subcategories: Object.values(category.subcategories || {}).map(sub => ({
        name: sub.name,
        slug: sub.slug
      }))
    }));
  }, [categories]);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  const handleCartClick = () => {
    if (onCartClick) onCartClick();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // 🎯 NUEVA FUNCIÓN: Manejar búsqueda con tracking
  const handleSearch = (value) => {
    // Llamar a la función de búsqueda original
    if (onSearch) {
      onSearch(value);
    }
    
    // 🎯 META PIXEL: Rastrear búsqueda (solo si tiene 3+ caracteres)
    if (value.trim().length >= 3) {
      MetaPixel.trackSearch(value.trim());
    }
  };
  
  return (
    <header className="sticky top-0 z-40 glass-card shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar - Información promocional */}
        <div className="bg-animated-gradient text-white text-center py-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4">
          <p className="text-sm font-medium">
            ✨ Envío gratis en compras superiores a $200.000 | 🎉 Hasta 50% OFF en productos seleccionados
          </p>
        </div>

        {/* Header Principal */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={onHomeClick}
              className="flex-shrink-0 focus:outline-none group"
            >
              <h1 className="text-3xl font-black text-gradient-mixxo hover:scale-105 transition-transform duration-300">
                mixxo
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                Todo en un lugar
              </p>
            </button>
          </div>

          {/* Barra de búsqueda - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className={`relative transition-all duration-300 ${
              isSearchFocused ? 'transform scale-105' : ''
            }`}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg 
                  className={`h-5 w-5 transition-colors duration-300 ${
                    isSearchFocused ? 'text-mixxo-pink-500' : 'text-gray-400'
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
  className={`block w-full pl-12 pr-4 py-3 rounded-2xl leading-5 transition-all duration-300 font-medium ${
    isSearchFocused 
      ? 'border-2 border-mixxo-pink-500 shadow-mixxo bg-white ring-4 ring-mixxo-pink-500/10' 
      : 'border-2 border-gray-200 hover:border-gray-300 bg-gray-50'
  }`}
  placeholder="Busca productos, marcas, categorías..."
  value={searchQuery || ''}
  onChange={(e) => handleSearch(e.target.value)}
  onFocus={() => setIsSearchFocused(true)}
  onBlur={() => setIsSearchFocused(false)}
/>
            </div>
          </div>

          {/* Acciones del usuario - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Carrito */}
            <button
              onClick={handleCartClick}
              className="relative p-3 text-gray-600 hover:text-mixxo-pink-500 hover:bg-mixxo-pink-50 rounded-2xl transition-all duration-200 group"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 badge-mixxo h-6 w-6 flex items-center justify-center animate-pulse">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Botón Admin */}
            {isAdmin && (
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onAdminClick && onAdminClick();
                }}
                className="relative p-3 text-gray-600 hover:text-mixxo-purple-500 hover:bg-mixxo-purple-50 rounded-2xl transition-all duration-200"
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
                  className="flex items-center space-x-3 text-gray-700 hover:text-mixxo-pink-500 transition-all duration-200 p-2 rounded-2xl hover:bg-mixxo-pink-50 group"
                >
                  <div className="w-10 h-10 bg-gradient-mixxo rounded-full flex items-center justify-center shadow-mixxo">
                    <span className="text-white text-sm font-bold">
                      {getInitials(user?.firstName, user?.lastName)}
                    </span>
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.role === 'admin' ? 'Admin' : 'Cliente'}
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
                  <div className="absolute right-0 mt-3 w-72 glass-card rounded-2xl shadow-mixxo-lg border border-gray-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-mixxo rounded-full flex items-center justify-center shadow-mixxo">
                          <span className="text-white font-bold text-lg">
                            {getInitials(user?.firstName, user?.lastName)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user?.firstName || ''} {user?.lastName || ''}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email || ''}</p>
                          {user?.role === 'admin' && (
                            <span className="badge-mixxo mt-1">
                              Administrador
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          onProfileClick && onProfileClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-mixxo-pink-50 hover:text-mixxo-pink-600 transition-colors duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Mi Perfil</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          onProfileClick && onProfileClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-mixxo-cyan-50 hover:text-mixxo-cyan-600 transition-colors duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Mis Pedidos</span>
                      </button>

                      <button
                        onClick={() => {
                          handleCartClick();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-mixxo-purple-50 hover:text-mixxo-purple-600 transition-colors duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                        <span className="font-medium">Mi Carrito</span>
                        {totalItems > 0 && (
                          <span className="ml-auto badge-mixxo">
                            {totalItems}
                          </span>
                        )}
                      </button>
                      
                      {isAdmin && (
                        <>
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={() => {
                              onAdminClick && onAdminClick();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-mixxo-purple-50 hover:text-mixxo-purple-600 transition-colors duration-200 group"
                          >
                            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Panel Admin</span>
                          </button>
                        </>
                      )}
                      
                      <hr className="my-2 border-gray-100" />
                      
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={openLoginModal}
                  className="text-gray-600 hover:text-mixxo-pink-500 font-semibold transition-colors px-4 py-2 rounded-xl hover:bg-mixxo-pink-50"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={openRegisterModal}
                  className="btn-mixxo"
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
              className="relative p-2 text-gray-600 hover:text-mixxo-pink-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 16h14M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 badge-mixxo h-5 w-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-mixxo-pink-500 transition-colors"
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
  className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:border-mixxo-pink-500 focus:ring-2 focus:ring-mixxo-pink-500/20"
  placeholder="Buscar productos..."
  value={searchQuery || ''}
  onChange={(e) => handleSearch(e.target.value)}
/>
          </div>
        </div>

        {/* Barra de Navegación */}
        <nav className="border-t border-gray-100 py-3 hidden md:block">
          <div className="flex items-center justify-center space-x-6">
            <div className="relative" ref={categoriesMenuRef}>
              <button 
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-mixxo-pink-500 font-semibold transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-mixxo-pink-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Categorías</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${showCategoriesMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCategoriesMenu && (
  <div className="absolute top-full left-0 mt-2 w-96 glass-card rounded-2xl shadow-mixxo-lg border border-gray-100 py-4 z-50 animate-scale-in max-h-[70vh] overflow-y-auto">
    {loadingCategories ? (
      <div className="px-4 py-8 text-center">
        <div className="spinner-mixxo mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Cargando...</p>
      </div>
    ) : mainCategories.length === 0 ? (
      <div className="px-4 py-8 text-center text-gray-500">
        No hay categorías
      </div>
    ) : (
      <>
        <div className="grid grid-cols-2 gap-4 px-4">
          {mainCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <button
                onClick={() => {
                  onCategoryClick && onCategoryClick(category.name);
                  setShowCategoriesMenu(false);
                }}
                className="font-semibold text-gray-800 hover:text-mixxo-pink-500 transition-colors text-left flex items-center space-x-2 w-full group"
              >
                {category.icon && <span className="text-xl group-hover:scale-110 transition-transform">{category.icon}</span>}
                <span>{category.name}</span>
              </button>
              {category.subcategories && category.subcategories.length > 0 && (
                <ul className="space-y-1 pl-8">
                  {category.subcategories.slice(0, 4).map((sub, subIndex) => (
                    <li key={subIndex}>
                      <button
                        onClick={() => {
                          onCategoryClick && onCategoryClick(sub.name);
                          setShowCategoriesMenu(false);
                        }}
                        className="text-sm text-gray-600 hover:text-mixxo-cyan-500 transition-colors text-left"
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        {/* Indicador de scroll */}
        {mainCategories.length > 6 && (
          <div className="text-center pt-3 border-t border-gray-100 mt-3">
            <p className="text-xs text-gray-500">
              ↕️ Desliza para ver más categorías
            </p>
          </div>
        )}
      </>
    )}
  </div>
)}
    
    {/* 🔥 INDICADOR DE SCROLL */}
    {mainCategories.length > 6 && (
      <div className="text-center pt-3 border-t border-gray-100 mt-3">
        <p className="text-xs text-gray-500">
          ↕️ Desliza para ver más categorías
        </p>
      </div>
    )}
  </div>
)}
            
            <button 
              onClick={onOffersClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-mixxo-pink-500 font-semibold transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-mixxo-pink-50"
            >
              <span className="text-lg">🔥</span>
              <span>Ofertas</span>
            </button>
            
            <button 
              onClick={onNewProductsClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-mixxo-cyan-500 font-semibold transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-mixxo-cyan-50"
            >
              <span className="text-lg">✨</span>
              <span>Nuevos</span>
            </button>
            
            <button 
              onClick={onBrandsClick}
              className="text-gray-600 hover:text-mixxo-purple-500 font-semibold transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-mixxo-purple-50"
            >
              Marcas
            </button>
            
            <button 
              onClick={onSupportClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-mixxo-cyan-500 font-semibold transition-colors duration-200 px-3 py-2 rounded-xl hover:bg-mixxo-cyan-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
