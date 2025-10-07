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

  const handleViewProduct = (productId) => {
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
    {/* Hero Section con diseño mixxo */}
    <section className="relative bg-animated-gradient text-white py-32 overflow-hidden">
      {/* Elementos flotantes decorativos */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl float-element"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-mixxo-cyan-bright/20 rounded-full blur-3xl float-element" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-mixxo-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Logo animado */}
          <div className="mb-8 animate-scale-in">
            <h1 className="text-6xl md:text-8xl font-black mb-4 text-white drop-shadow-lg">
              mixxo
            </h1>
            <div className="flex items-center justify-center gap-3 text-xl md:text-2xl font-semibold">
              <div className="w-16 h-1 bg-white/50 rounded-full"></div>
              <span>TODO EN UN LUGAR</span>
              <div className="w-16 h-1 bg-white/50 rounded-full"></div>
            </div>
          </div>
          
          <p className="text-2xl md:text-3xl mb-12 text-white/90 max-w-3xl mx-auto font-medium leading-relaxed slide-in-bottom">
            Descubre productos increíbles con los mejores precios y la mejor calidad
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center slide-in-bottom" style={{animationDelay: '0.2s'}}>
            <button 
              onClick={() => handleViewCatalog()}
              className="group relative overflow-hidden bg-white text-mixxo-pink-500 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Explorar Catálogo
              </span>
            </button>
            <button 
              onClick={() => handleViewCatalog('all', 'ofertas')}
              className="group glass-dark backdrop-blur-md text-white px-10 py-5 rounded-2xl font-bold text-lg border-2 border-white/30 hover:border-white transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl">🔥</span>
                Ver Ofertas
              </span>
            </button>
          </div>
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

    {/* Ofertas Especiales con diseño llamativo */}
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

    {/* Beneficios de la tienda */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            ¿Por qué elegir <span className="text-gradient-mixxo">mixxo</span>?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: '💰',
              title: 'Mejores Precios',
              description: 'Precios competitivos garantizados',
              gradient: 'from-mixxo-pink-500 to-mixxo-purple-500'
            },
            {
              icon: '✅',
              title: 'Calidad Premium',
              description: 'Productos originales certificados',
              gradient: 'from-green-500 to-mixxo-cyan-500'
            },
            {
              icon: '🚚',
              title: 'Envío Express',
              description: 'Recibe en 24-48 horas',
              gradient: 'from-mixxo-cyan-500 to-mixxo-purple-500'
            },
            {
              icon: '🎧',
              title: 'Soporte 24/7',
              description: 'Siempre aquí para ayudarte',
              gradient: 'from-mixxo-purple-500 to-mixxo-pink-500'
            }
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

    {/* Newsletter con diseño atractivo */}
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
        <footer className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">TechStore</h3>
                <p className="text-gray-400">
                  Tu tienda de confianza para productos de todas las categorías.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categorías</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => handleViewCatalog('tecnologia')} className="hover:text-white transition-colors">Tecnología</button></li>
                  <li><button onClick={() => handleViewCatalog('hogar')} className="hover:text-white transition-colors">Hogar</button></li>
                  <li><button onClick={() => handleViewCatalog('deportes')} className="hover:text-white transition-colors">Deportes</button></li>
                  <li><button onClick={() => handleViewCatalog('moda')} className="hover:text-white transition-colors">Moda</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Ayuda</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Envíos</li>
                  <li>Devoluciones</li>
                  <li>Garantías</li>
                  <li>Soporte</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contacto</h4>
                <div className="space-y-2 text-gray-400">
                  <p>📞 +57 300 123 4567</p>
                  <p>📧 contacto@techstore.com</p>
                  <p>📍 Bogotá, Colombia</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 TechStore. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <PWAHelper />
            <AppContent />
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
