import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Shield, MessageCircle, Filter, ChevronDown, ChevronUp } from 'lucide-react';

const ProductReviews = ({ reviews = [], productRating, totalReviews }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  // Función para renderizar estrellas
  const renderStars = (rating, size = 'w-4 h-4') => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${size} ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Calcular distribución de calificaciones
  const ratingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  // Filtrar y ordenar reseñas
  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];

    // Filtrar por calificación
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Ordenar
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  // Manejar voto útil
  const handleHelpfulVote = (reviewId, isHelpful) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: isHelpful
    }));
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const distribution = ratingDistribution();
  const filteredReviews = getFilteredAndSortedReviews();

  // Componente de formulario para escribir reseña
  const WriteReviewForm = () => (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h4 className="text-lg font-semibold mb-4">Escribe tu reseña</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la reseña
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Resumen de tu experiencia"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu reseña
          </label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Comparte tu experiencia con este producto..."
          />
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Publicar reseña
          </button>
          <button 
            onClick={() => setShowWriteReview(false)}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header de reseñas */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Reseñas de clientes</h3>
          {!showWriteReview && (
            <button
              onClick={() => setShowWriteReview(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Escribir reseña</span>
            </button>
          )}
        </div>

        {/* Formulario de escribir reseña */}
        {showWriteReview && <WriteReviewForm />}
      </div>

      {/* Resumen de calificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-lg">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl font-bold text-gray-900">{productRating}</div>
            <div>
              <div className="flex mb-1">{renderStars(productRating, 'w-5 h-5')}</div>
              <div className="text-sm text-gray-600">{totalReviews} reseñas</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Distribución de calificaciones</h4>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = distribution[rating] || 0;
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 min-w-[60px]">
                    <span className="text-sm">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[40px]">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Filtrar:</span>
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las calificaciones</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="highest">Calificación más alta</option>
            <option value="lowest">Calificación más baja</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">
              No hay reseñas disponibles
            </h4>
            <p className="text-gray-500">
              {filterRating !== 'all' 
                ? 'No hay reseñas con esta calificación.' 
                : 'Sé el primero en escribir una reseña.'
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {review.user.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h5 className="font-semibold text-gray-900">{review.user}</h5>
                      {review.verified && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Shield className="w-4 h-4" />
                          <span className="text-xs">Compra verificada</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="font-semibold text-gray-900 mb-2">{review.title}</h6>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">¿Te resultó útil?</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleHelpfulVote(review.id, true)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                        helpfulVotes[review.id] === true
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Sí</span>
                    </button>
                    <button
                      onClick={() => handleHelpfulVote(review.id, false)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                        helpfulVotes[review.id] === false
                          ? 'bg-red-100 text-red-700'
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>No</span>
                    </button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {review.helpful} personas encontraron esto útil
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación de reseñas si hay muchas */}
      {filteredReviews.length > 5 && (
        <div className="text-center">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Ver más reseñas
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;