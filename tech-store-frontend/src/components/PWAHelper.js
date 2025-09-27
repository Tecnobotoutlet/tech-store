// src/components/PWAHelper.js - Componente para manejar funcionalidades PWA
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, Smartphone, Bell, RefreshCw } from 'lucide-react';

const PWAHelper = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  useEffect(() => {
    // Detectar si ya está instalado como PWA
    const checkIfInstalled = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppMode = window.navigator.standalone === true;
      setIsInstalled(isInStandaloneMode || isInWebAppMode);
    };

    checkIfInstalled();

    // Escuchar cambios en el estado de conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Escuchar evento de instalación PWA
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar prompt personalizado después de un tiempo si no está instalado
      if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 10000); // Mostrar después de 10 segundos
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detectar cuando se instala la PWA
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Mostrar mensaje de bienvenida
      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('¡TechStore instalado!', {
            body: 'Ahora puedes acceder rápidamente desde tu pantalla de inicio',
            icon: '/icons/icon-192x192.png'
          });
        }
      }, 1000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Registrar Service Worker y escuchar actualizaciones
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration);
          
          // Escuchar actualizaciones del SW
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        });

      // Escuchar mensajes del Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CART_SYNCED') {
          showToast('Carrito sincronizado correctamente', 'success');
        }
        if (event.data.type === 'CACHE_UPDATED') {
          showToast('Contenido actualizado disponible offline', 'info');
        }
      });
    }

    // Verificar permisos de notificación
    if ('Notification' in window && Notification.permission === 'default' && !isInstalled) {
      setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 15000); // Mostrar después de 15 segundos
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación');
      } else {
        console.log('Usuario rechazó la instalación');
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleUpdateClick = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const handleNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Notificaciones habilitadas', 'success');
        
        // Suscribirse a push notifications si está disponible
        if (swRegistration && 'pushManager' in swRegistration) {
          try {
            // Aquí implementarías la suscripción real a push notifications
            console.log('Push notifications setup');
          } catch (error) {
            console.error('Error setting up push notifications:', error);
          }
        }
      }
    }
    setShowNotificationPrompt(false);
  };

  const showToast = (message, type = 'info') => {
    // Crear toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      font-size: 14px;
      font-weight: 500;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 4000);
  };

  const addToHomeScreen = () => {
    // Para dispositivos que no soportan beforeinstallprompt
    showToast('Para instalar: usa el menú del navegador y selecciona "Añadir a pantalla de inicio"', 'info');
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TechStore - Tu Tienda de Tecnología',
          text: 'Descubre los mejores productos tecnológicos',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para navegadores sin Web Share API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.origin);
        showToast('Link copiado al portapapeles', 'success');
      }
    }
  };

  const enableOfflineMode = () => {
    // Cachear productos populares para modo offline
    if ('serviceWorker' in navigator && swRegistration) {
      swRegistration.active?.postMessage({
        type: 'CACHE_POPULAR_PRODUCTS'
      });
      showToast('Productos guardados para uso offline', 'success');
    }
  };

  return (
    <>
      {/* Indicador de Estado de Conexión */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-center py-2 text-sm font-medium z-50 animate-pulse">
          <WifiOff className="inline w-4 h-4 mr-2" />
          Sin conexión - Modo offline activado
        </div>
      )}

      {/* Prompt de Instalación PWA */}
      {showInstallPrompt && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl border p-4 z-50 max-w-sm mx-auto animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">¡Instala TechStore!</h3>
              <p className="text-sm text-gray-600 mb-3">
                Accede más rápido y disfruta de una experiencia nativa
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Instalar
                </button>
                <button
                  onClick={() => {
                    setShowInstallPrompt(false);
                    localStorage.setItem('pwa-install-dismissed', 'true');
                  }}
                  className="text-gray-600 px-4 py-2 text-sm hover:text-gray-800 transition-colors"
                >
                  Ahora no
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt de Actualización */}
      {showUpdatePrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white rounded-lg shadow-xl p-4 z-50 max-w-sm mx-auto">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Nueva versión disponible</h3>
              <p className="text-sm opacity-90 mb-3">
                Actualiza para obtener las últimas mejoras
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateClick}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => setShowUpdatePrompt(false)}
                  className="text-white/80 px-4 py-2 text-sm hover:text-white transition-colors"
                >
                  Después
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt de Notificaciones */}
      {showNotificationPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl border p-4 z-50 max-w-sm mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Mantente informado</h3>
              <p className="text-sm text-gray-600 mb-3">
                Recibe notificaciones sobre ofertas y nuevos productos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleNotificationPermission}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                >
                  Permitir
                </button>
                <button
                  onClick={() => setShowNotificationPrompt(false)}
                  className="text-gray-600 px-4 py-2 text-sm hover:text-gray-800 transition-colors"
                >
                  No gracias
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción PWA (solo visible si no está instalado) */}
      {!isInstalled && (
        <div className="fixed bottom-20 right-4 z-40">
          <div className="flex flex-col gap-2">
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center group hover:w-auto hover:px-4"
                title="Instalar App"
              >
                <Download className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Instalar
                </span>
              </button>
            )}
            
            <button
              onClick={shareApp}
              className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center group hover:w-auto hover:px-4"
              title="Compartir App"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="ml-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Compartir
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Indicador de Conexión Restaurada */}
      {isOnline && (
        <style jsx>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slideUp 0.3s ease-out;
          }
        `}</style>
      )}
    </>
  );
};

export default PWAHelper;