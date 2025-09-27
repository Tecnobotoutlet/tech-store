import React from 'react';
import { Star, ShoppingCart, Eye, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const RelatedProducts = ({ products = [], category, onProductClick }) => {
  const { addToCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleViewProduct = (product, e) => {
    e.stopPropagation();
    onProductClick(product.id);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Productos similares
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Otros productos de {category} que te podrían interesar
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 text-sm font-medium">
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleViewProduct(product)}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      NUEVO
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                    <button
                      onClick={(e) => handleViewProduct(product, e)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Ver producto"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={!product.inStock}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      title={product.inStock ? "Agregar al carrito" : "No disponible"}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Brand & Category */}
                <div className="text-xs text-blue-600 font-medium mb-1">
                  {product.brand || product.category}
                </div>

                {/* Product Name */}
                <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mt-2">
                  {product.inStock ? (
                    <span className="text-xs text-green-600 font-medium">
                      ✅ En stock
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 font-medium">
                      ❌ Agotado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-6 text-center">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto">
            <span>Ver más productos de {category}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Envío gratis</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Garantía incluida</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Devolución fácil</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;