import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  const Lightbox = () => {
    // Block body scroll when lightbox is open
    React.useEffect(() => {
      const scrollY = window.scrollY;
      
      // Agregar clase al body
      document.body.classList.add('lightbox-active');
      
      // Bloquear scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Focus en el lightbox
      setTimeout(() => {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
          lightbox.focus();
        }
      }, 100);
      
      return () => {
        // Remover clase del body
        document.body.classList.remove('lightbox-active');
        
        // Restaurar scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }, []);

    const lightboxContent = (
      <div 
        className="lightbox-overlay"
        onClick={closeLightbox}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="dialog"
        aria-modal="true"
        aria-label="Visor de imágenes en pantalla completa"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2147483647,
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          isolation: 'isolate'
        }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center p-4" 
          style={{ zIndex: 2147483646 }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all hover:scale-110 z-50"
            aria-label="Cerrar visor de imágenes"
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
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all hover:scale-110 z-50"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all hover:scale-110 z-50"
                aria-label="Imagen siguiente"
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
            style={{ 
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              zIndex: 2147483646
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image Counter */}
          {images.length > 1 && (
            <div 
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium z-50"
            >
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    );

    // Renderizar usando Portal directamente en el body
    return createPortal(lightboxContent, document.body);
  };

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
                className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 text-gray-800 p-2.5 rounded-full hover:bg-opacity-100 transition-all duration-300 transform group-hover:scale-105"
                aria-label="Ver imagen en pantalla completa"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Arrows - Solo si hay múltiples imágenes */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Zoom Hint */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black bg-opacity-50 text-white text-[10px] px-2 py-1 rounded flex items-center space-x-1">
                <ZoomIn className="w-2.5 h-2.5" />
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
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  selectedImageIndex === index
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
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
          <div className="text-center text-xs text-gray-600">
            Imagen {selectedImageIndex + 1} de {images.length}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-center pt-1">
          <button
            onClick={openLightbox}
            className="flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Ver en pantalla completa</span>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && <Lightbox />}
    </>
  );
};

export default ImageGallery;
