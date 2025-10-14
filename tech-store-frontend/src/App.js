// src/App.js - Versión con WhatsApp Chatbot
import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider, useProducts } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import ProductFilters from './components/ProductFilters';
import ProductResults from './components/ProductResults';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import PaymentResult from './components/PaymentResult';
import AuthModal from './components/AuthModal';
import NotificationSystem from './components/NotificationSystem';
import AdminPanel from './components/admin/AdminPanel';
import useProductFilters from './hooks/useProductFilters';
import PWAHelper from './components/PWAHelper';
import UserProfile from './components/UserProfile';
import WhatsAppButton from './components/WhatsAppButton';
import ProductCarousel from './components/ProductCarousel';
import MetaPixel from './services/MetaPixel';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';



// Componente interno que usa el contexto
function AppContent() {
  const { 
    products, 
    getFeaturedProducts, 
    getNewProducts, 
    getDiscountedProducts 
  } = useProducts();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentSection, setCurrentSection] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentResultType, setPaymentResultType] = useState('success');

  const productFilters = useProductFilters(products);
  
  const filteredProducts = productFilters?.filteredProducts || products;
  const searchTerm = productFilters?.searchTerm || '';
  const selectedCategories = productFilters?.selectedCategories || [];
  const priceRange = productFilters?.priceRange || [0, 10000000];
  const minRating = productFilters?.minRating || 0;
  const sortBy = productFilters?.sortBy || 'name';
  const showOnlyInStock = productFilters?.showOnlyInStock || false;
  const filterStats = productFilters?.filterStats || {};
  const handleSearchChange = productFilters?.handleSearchChange || (() => {});
  const handleCategoryChange = productFilters?.handleCategoryChange || (() => {});
  const handlePriceRangeChange = productFilters?.handlePriceRangeChange || (() => {});
  const handleRatingChange = productFilters?.handleRatingChange || (() => {});
  const handleSortChange = productFilters?.handleSortChange || (() => {});
  const handleStockFilterChange = productFilters?.handleStockFilterChange || (() => {});
  
  const [showUserProfile, setShowUserProfile] = useState(false);

  const featuredProducts = getFeaturedProducts();
  const newProducts = getNewProducts();
  const saleProducts = getDiscountedProducts();

  // Handlers de navegación
  const handleCartClick = () => setIsCartOpen(true);
  const handleCartClose = () => setIsCartOpen(false);
  
  const handleViewHome = () => {
    setCurrentView('home');
    setCurrentSection('home');
    setCurrentCategory('all');
    setSelectedProductId(null);
  };

  const handleViewProfile = () => {
    setShowUserProfile(true);
  };

  const handleCloseProfile = () => {
    setShowUserProfile(false);
  };

  const handleViewCatalog = (category = 'all', section = 'all') => {
    setCurrentView('catalog');
    setCurrentCategory(category);
    setCurrentSection(section);
    
    if (category !== 'all') {
      handleCategoryChange([category]);
    } else {
      handleCategoryChange([]);
    }
  };

  const handleViewAdmin = () => {
    setCurrentView('admin');
    setSelectedProductId(null);
  };

  const handleBackFromAdmin = () => {
    setCurrentView('home');
    setSelectedProductId(null);
  };

  const handleViewProduct = (productId, productSlug) => {
  // Si se proporciona slug, navegar a la URL con slug
  if (productSlug && window.location.pathname !== '/') {
    window.location.href = `/producto/${productSlug}`;
  } else {
    setSelectedProductId(productId);
    setCurrentView('product');
  }
};
    setSelectedProductId(productId);
    setCurrentView('product');
  };

  const handleBackFromProduct = () => {
    setCurrentView('catalog');
    setSelectedProductId(null);
  };

  const handleCheckout = () => setCurrentView('checkout');
  const handleBackFromCheckout = () => setCurrentView('home');

  const handlePaymentSuccess = (data) => {
    setPaymentData(data);
    setPaymentResultType('success');
    setCurrentView('payment-result');
  };

  const handlePaymentError = (data) => {
    setPaymentData(data);
    setPaymentResultType('error');
    setCurrentView('payment-result');
  };

  const handleBackToHomeFromPayment = () => {
    setCurrentView('home');
    setPaymentData(null);
  };

  const handleViewOrder = () => {
    alert('Funcionalidad de seguimiento de pedidos próximamente');
  };

  const renderHomeView = () => (
  <main>
    {/* CARRUSEL DIRECTO - Sin hero previo */}
    <section className="relative bg-animated-gradient text-white py-12 overflow-hidden">
      {/* Elementos flotantes decorativos */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl float-element"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-mixxo-cyan-bright/20 rounded-full blur-3xl float-element" style={{animationDelay: '2s'}}></div>
      
      <div className="relative container mx-auto px-4">
        {/* 🎨 CARRUSEL DE PRODUCTOS - INMEDIATAMENTE */}
        <ProductCarousel 
          products={products}
          onProductClick={handleViewProduct}
          autoPlaySpeed={4000}
        />
      </div>
    </section>

    {/* Banner de bienvenida compacto DESPUÉS del carrusel */}
    <section className="py-12 bg-gradient-to-br from-mixxo-pink-500 via-mixxo-purple-500 to-mixxo-cyan-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg">
          Bienvenido a <span className="text-white">mixxo</span>
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Todo lo que necesitas en un solo lugar con los mejores precios
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => handleViewCatalog()}
            className="bg-white text-mixxo-pink-500 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ver Todo el Catálogo
            </span>
          </button>
          <button 
            onClick={() => handleViewCatalog('all', 'ofertas')}
            className="glass-dark backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-2xl">🔥</span>
              Mejores Ofertas
            </span>
          </button>
        </div>
      </div>
    </section>

    {/* Categorías con diseño moderno */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Explora por <span className="text-gradient-mixxo">Categorías</span>
          </h2>
          <p className="text-gray-600 text-xl font-medium">
            Encuentra exactamente lo que necesitas
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { name: 'Tecnología', icon: '📱', category: 'tecnologia', gradient: 'from-mixxo-pink-500 to-mixxo-purple-500' },
            { name: 'Hogar', icon: '🏠', category: 'hogar', gradient: 'from-mixxo-cyan-500 to-mixxo-purple-500' },
            { name: 'Deportes', icon: '⚽', category: 'deportes', gradient: 'from-green-500 to-mixxo-cyan-500' },
            { name: 'Moda', icon: '👕', category: 'moda', gradient: 'from-mixxo-pink-500 to-mixxo-cyan-500' },
            { name: 'Libros', icon: '📚', category: 'libros', gradient: 'from-orange-500 to-mixxo-pink-500' },
            { name: 'Salud', icon: '💊', category: 'salud', gradient: 'from-mixxo-purple-500 to-mixxo-pink-500' }
          ].map((cat, index) => (
            <button
              key={index}
              onClick={() => handleViewCatalog(cat.category)}
              className="group relative p-8 glass-card rounded-3xl hover:shadow-mixxo-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative">
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-800 group-hover:text-gradient-mixxo transition-colors text-lg">
                  {cat.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* Productos Destacados */}
    {featuredProducts.length > 0 && (
      <section className="py-20 section-gradient-1">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                <span className="text-gradient-pink">Destacados</span> del Mes
              </h2>
              <p className="text-gray-600 text-xl font-medium">
                Los productos más populares y mejor valorados
              </p>
            </div>
            <button 
              onClick={() => handleViewCatalog('all', 'destacados')}
              className="hidden md:block btn-cyan"
            >
              Ver Todos
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={handleViewProduct}
              />
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Ofertas Especiales */}
    {saleProducts.length > 0 && (
      <section className="py-20 bg-gradient-to-br from-mixxo-pink-50 via-mixxo-purple-50 to-mixxo-cyan-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-mixxo-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-mixxo-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex justify-between items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-3 bg-gradient-mixxo text-white px-6 py-3 rounded-full font-bold text-sm mb-4 shadow-mixxo">
                <span className="text-2xl">🔥</span>
                OFERTAS LIMITADAS
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Aprovecha Hasta <span className="text-gradient-mixxo">50% OFF</span>
              </h2>
              <p className="text-gray-600 text-xl font-medium">
                Descuentos increíbles por tiempo limitado
              </p>
            </div>
            <button 
              onClick={() => handleViewCatalog('all', 'ofertas')}
              className="hidden md:block btn-mixxo"
            >
              Ver Ofertas
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {saleProducts.slice(0, 8).map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductClick={handleViewProduct}
              />
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Beneficios */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            ¿Por qué elegir <span className="text-gradient-mixxo">mixxo</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '💰', title: 'Mejores Precios', description: 'Precios competitivos garantizados', gradient: 'from-mixxo-pink-500 to-mixxo-purple-500' },
            { icon: '✅', title: 'Calidad Premium', description: 'Productos originales certificados', gradient: 'from-green-500 to-mixxo-cyan-500' },
            { icon: '🚚', title: 'Envío Express', description: 'Recibe en 24-48 horas', gradient: 'from-mixxo-cyan-500 to-mixxo-purple-500' },
            { icon: '🎧', title: 'Soporte 24/7', description: 'Siempre aquí para ayudarte', gradient: 'from-mixxo-purple-500 to-mixxo-pink-500' }
          ].map((feature, index) => (
            <div key={index} className="group text-center p-8 glass-card rounded-3xl hover:shadow-mixxo-lg transition-all duration-300 hover:-translate-y-2">
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Newsletter */}
    <section className="py-20 bg-gradient-mixxo text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl float-element"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl float-element" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Únete a la Familia mixxo
          </h2>
          <p className="text-xl mb-10 text-white/90 font-medium">
            Recibe ofertas exclusivas, nuevos productos y descuentos especiales
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-6 py-4 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium"
            />
            <button className="bg-white text-mixxo-pink-500 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-xl">
              Suscribirme 🎉
            </button>
          </div>
          <p className="text-white/70 text-sm mt-6">
            🔒 Tu información está segura. Sin spam.
          </p>
        </div>
      </div>
    </section>
  </main>
);

  const renderCatalogView = () => (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button 
                onClick={handleViewHome}
                className="hover:text-blue-600 transition-colors"
              >
                Inicio
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Catálogo</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {currentSection === 'ofertas' ? 'Ofertas Especiales' : 
             currentSection === 'nuevos' ? 'Nuevos Productos' : 
             'Catálogo de Productos'}
          </h1>
          <p className="text-gray-600 text-lg">
            {currentSection === 'ofertas' ? 'Los mejores descuentos y promociones' :
             currentSection === 'nuevos' ? 'Los últimos productos añadidos' :
             'Descubre nuestra amplia selección de productos'}
          </p>
        </div>

        <ProductFilters
          products={products}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceRangeChange={handlePriceRangeChange}
          minRating={minRating}
          onRatingChange={handleRatingChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          showOnlyInStock={showOnlyInStock}
          onStockFilterChange={handleStockFilterChange}
          onFilterChange={() => {}}
        />

        <ProductResults
          products={filteredProducts}
          filterStats={filterStats}
          searchTerm={searchTerm}
          selectedCategories={selectedCategories}
          onProductClick={handleViewProduct}
        />
      </div>
    </main>
  );

  const renderProductView = () => (
    <ProductDetail 
      productId={selectedProductId}
      onBack={handleBackFromProduct}
      onProductClick={handleViewProduct}
    />
  );

  const renderCheckoutView = () => (
    <Checkout 
      onBack={handleBackFromCheckout}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
    />
  );

  const renderPaymentResultView = () => (
    <PaymentResult 
      paymentData={paymentData}
      type={paymentResultType}
      onBackToHome={handleBackToHomeFromPayment}
      onViewOrder={handleViewOrder}
    />
  );

  const renderAdminView = () => (
    <AdminPanel onBackToStore={handleBackFromAdmin} />
  );

  return (
    <div className="App min-h-screen bg-gray-50">
      {currentView !== 'admin' && (
        <Header 
          onCartClick={handleCartClick}
          onSearch={handleSearchChange}
          searchQuery={searchTerm}
          onAdminClick={handleViewAdmin}
          onCategoryClick={handleViewCatalog}
          onOffersClick={() => handleViewCatalog('all', 'ofertas')}
          onNewProductsClick={() => handleViewCatalog('all', 'nuevos')}
          onBrandsClick={() => handleViewCatalog()}
          onSupportClick={() => alert('Soporte próximamente')}
          onHomeClick={handleViewHome}
          onProfileClick={handleViewProfile}
        />
      )}
      
      {currentView !== 'admin' && (
        <Cart
          isOpen={isCartOpen} 
          onClose={handleCartClose} 
          onCheckout={handleCheckout} 
        />
      )}
      
      <AuthModal />
      <NotificationSystem />

      {showUserProfile && (
        <UserProfile onClose={handleCloseProfile} />
      )}

      {/* 🔥 Botón flotante de WhatsApp con Chatbot */}
      {currentView !== 'admin' && (
        <WhatsAppButton 
          phoneNumber="573144505320"
          companyName="TechStore"
          position="right"
          showTooltip={true}
        />
      )}
      
      {currentView === 'home' && renderHomeView()}
      {currentView === 'catalog' && renderCatalogView()}
      {currentView === 'product' && renderProductView()}
      {currentView === 'checkout' && renderCheckoutView()}
      {currentView === 'payment-result' && renderPaymentResultView()}
      {currentView === 'admin' && renderAdminView()}

      {!['admin', 'checkout', 'payment-result'].includes(currentView) && (
  <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-96 h-96 bg-mixxo-pink-500/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-mixxo-cyan-500/5 rounded-full blur-3xl"></div>
    
    <div className="container mx-auto px-4 relative">
      {/* Main Footer Content */}
      <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-4xl font-black text-gradient-mixxo mb-2">mixxo</h2>
            <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Todo en un lugar
            </p>
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Tu tienda de confianza para encontrar los mejores productos de todas las categorías con la mejor calidad y al mejor precio.
          </p>
          
          {/* Social Media */}
          <div className="flex gap-3 mb-8">
            {[
              { icon: '📱', name: 'Instagram', color: 'from-mixxo-pink-500 to-mixxo-purple-500' },
              { icon: '💬', name: 'WhatsApp', color: 'from-green-500 to-emerald-500' },
              { icon: '📘', name: 'Facebook', color: 'from-mixxo-cyan-500 to-blue-500' },
              { icon: '🐦', name: 'Twitter', color: 'from-mixxo-cyan-500 to-blue-400' }
            ].map((social, index) => (
              <button
                key={index}
                className={`w-12 h-12 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform duration-200 shadow-lg`}
                title={social.name}
              >
                {social.icon}
              </button>
            ))}
          </div>

          {/* Newsletter */}
          <div className="glass-dark backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-xl">📧</span>
              Newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">Recibe ofertas exclusivas</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-mixxo-pink-500 focus:ring-2 focus:ring-mixxo-pink-500/20"
              />
              <button className="bg-gradient-mixxo px-4 py-2 rounded-xl font-bold hover:shadow-mixxo transition-shadow">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div>
          <h4 className="font-black text-white mb-6 text-lg">Categorías</h4>
          <ul className="space-y-3">
            {[
              { name: 'Tecnología', icon: '📱' },
              { name: 'Hogar', icon: '🏠' },
              { name: 'Deportes', icon: '⚽' },
              { name: 'Moda', icon: '👕' },
              { name: 'Libros', icon: '📚' },
              { name: 'Salud', icon: '💊' }
            ].map((cat, index) => (
              <li key={index}>
                <button 
                  onClick={() => handleViewCatalog(cat.name.toLowerCase())} 
                  className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group"
                >
                  <span className="text-lg group-hover:scale-125 transition-transform">{cat.icon}</span>
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Ayuda */}
        <div>
          <h4 className="font-black text-white mb-6 text-lg">Ayuda</h4>
          <ul className="space-y-3">
            {[
              { name: 'Envíos', icon: '🚚' },
              { name: 'Devoluciones', icon: '↩️' },
              { name: 'Garantías', icon: '🛡️' },
              { name: 'Soporte', icon: '💬' },
              { name: 'Políticas', icon: '📋' },
              { name: 'Términos', icon: '📄' }
            ].map((item, index) => (
              <li key={index}>
                <button className="text-gray-400 hover:text-white transition-colors font-medium flex items-center gap-2 group">
                  <span className="group-hover:scale-125 transition-transform">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-black text-white mb-6 text-lg">Contacto</h4>
          <div className="space-y-4">
            <div className="glass-dark backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-mixxo-pink-500 to-mixxo-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📞</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Llámanos</div>
                  <div className="font-bold text-white">+57 300 123 4567</div>
                </div>
              </div>
            </div>

            <div className="glass-dark backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-mixxo-cyan-500 to-mixxo-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📧</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Email</div>
                  <div className="font-bold text-white text-sm">hola@mixxo.com</div>
                </div>
              </div>
            </div>

            <div className="glass-dark backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📍</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Ubicación</div>
                  <div className="font-bold text-white text-sm">Bogotá, Colombia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-white/10 py-8">
        <h4 className="font-bold text-white mb-4 text-center">Métodos de pago</h4>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { name: 'Tarjetas', icon: '💳', color: 'from-mixxo-pink-500 to-mixxo-purple-500' },
            { name: 'PSE', icon: '🏦', color: 'from-mixxo-cyan-500 to-blue-500' },
            { name: 'Nequi', icon: '📱', color: 'from-purple-500 to-pink-500' },
            { name: 'Efectivo', icon: '💵', color: 'from-green-500 to-emerald-500' }
          ].map((method, index) => (
            <div
              key={index}
              className={`glass-dark backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 flex items-center gap-2 hover:scale-105 transition-transform`}
            >
              <span className="text-2xl">{method.icon}</span>
              <span className="font-bold text-white">{method.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm font-medium">
            <p className="mb-1">&copy; 2025 mixxo. Todos los derechos reservados.</p>
            <p className="text-xs">Diseñado con <span className="text-mixxo-pink-500">❤️</span> en Colombia</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Privacidad
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Términos
            </button>
            <button className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
)}
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/producto/:slug" element={<ProductDetailRoute />} />
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

// NUEVO COMPONENTE - Wrapper para ProductDetail con slug de URL
function ProductDetailRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  // Buscar producto por slug o ID
  const product = products.find(p => p.slug === slug || p.id.toString() === slug);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Producto no encontrado</h2>
          <button onClick={() => navigate('/')} className="btn-mixxo">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Header 
        onCartClick={() => {}}
        onHomeClick={() => navigate('/')}
      />
      <ProductDetail 
        productId={product.id}
        onBack={() => navigate(-1)}
        onProductClick={(id, slug) => navigate(`/producto/${slug || id}`)}
      />
    </>
  );
}

function App() {
  useEffect(() => {
    MetaPixel.init();
  }, []);
  
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <PWAHelper />
            <AppWithRouter />
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}
export default App;
