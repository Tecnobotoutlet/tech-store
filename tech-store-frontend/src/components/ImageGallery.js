import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize } from 'lucide-react';

const ImageGallery = ({ images = [], productName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState({});

  const currentImage = images[selectedImageIndex] || images[0];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleImageLoad = (index) => {
    setIsImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  };

  // Lightbox Component
  const Lightbox = () => (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={closeLightbox}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-7xl max-h-full p-4">
        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main Image */}
        <img
          src={currentImage}
          alt={`${productName} - Imagen ${selectedImageIndex + 1}`}
          className="max-w-full max-h-full object-contain cursor-zoom-out"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">No hay imágenes disponibles</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {!isImageLoaded[selectedImageIndex] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 w-full h-full"></div>
              </div>
            )}
            <img
              src={currentImage}
              alt={`${productName} - Vista principal`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoaded[selectedImageIndex] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(selectedImageIndex)}
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <button
                onClick={openLightbox}
                className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 text-gray-800 p-3 rounded-full hover:bg-opacity-100 transition-all duration-300 transform group-hover:scale-105"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Arrows - Solo si hay múltiples imágenes */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Zoom Hint */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <ZoomIn className="w-3 h-3" />
                <span>Click para ampliar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageIndex === index
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} - Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="text-center text-sm text-gray-600">
            Imagen {selectedImageIndex + 1} de {images.length}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={openLightbox}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Maximize className="w-4 h-4" />
            <span className="text-sm font-medium">Ver en pantalla completa</span>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && <Lightbox />}
    </>
  );
};

export default ImageGallery;