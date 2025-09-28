// src/App.js - Versión Corregida
import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider, useProducts } from './context/ProductContext';
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
//import PWAHelper from './components/PWAHelper';

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Tu Tienda
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Todo en Uno
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">
              Los mejores productos de todas las categorías al mejor precio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleViewCatalog()}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorar Productos
              </button>
              <button 
                onClick={() => handleViewCatalog('all', 'ofertas')}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* Sección de Categorías */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Explora por Categorías
            </h2>
            <p className="text-gray-600 text-lg">
              Encuentra exactamente lo que buscas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Tecnología', icon: '📱', category: 'tecnologia' },
              { name: 'Hogar', icon: '🏠', category: 'hogar' },
              { name: 'Deportes', icon: '⚽', category: 'deportes' },
              { name: 'Moda', icon: '👕', category: 'moda' },
              { name: 'Libros', icon: '📚', category: 'libros' },
              { name: 'Salud', icon: '💊', category: 'salud' }
            ].map((cat, index) => (
              <button
                key={index}
                onClick={() => handleViewCatalog(cat.category)}
                className="group p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  Productos Destacados
                </h2>
                <p className="text-gray-600 text-lg">
                  Los productos más populares y mejor valorados
                </p>
              </div>
              <button 
                onClick={() => handleViewCatalog('all', 'destacados')}
                className="hidden md:block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  <span className="text-red-600">🔥</span> Ofertas Especiales
                </h2>
                <p className="text-gray-600 text-lg">
                  Aprovecha estos descuentos por tiempo limitado
                </p>
              </div>
              <button 
                onClick={() => handleViewCatalog('all', 'ofertas')}
                className="hidden md:block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
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

      {/* Características de la Tienda */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegirnos?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '💰',
                title: 'Mejores Precios',
                description: 'Precios competitivos garantizados en todos nuestros productos'
              },
              {
                icon: '✅',
                title: 'Calidad Garantizada',
                description: 'Productos originales con garantía oficial'
              },
              {
                icon: '🚚',
                title: 'Envío Gratis',
                description: 'Envío gratuito en compras superiores a $200.000'
              },
              {
                icon: '🎧',
                title: 'Soporte 24/7',
                description: 'Atención al cliente las 24 horas, todos los días'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Mantente Actualizado
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Recibe ofertas exclusivas y noticias sobre nuevos productos
          </p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              Suscribirse
            </button>
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
      <ProductProvider>
        <CartProvider>
          //<PWAHelper />
          <AppContent />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
