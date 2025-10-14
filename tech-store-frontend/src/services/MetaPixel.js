// tech-store-frontend/src/services/MetaPixel.js

class MetaPixelService {
  constructor() {
    this.pixelId = process.env.REACT_APP_META_PIXEL_ID || null;
    this.isInitialized = false;
  }

  /**
   * Inicializa Meta Pixel
   */
  init() {
    if (!this.pixelId) {
      console.warn('⚠️ Meta Pixel ID no configurado. Agrega REACT_APP_META_PIXEL_ID en tu .env');
      return;
    }

    if (this.isInitialized) {
      console.log('✅ Meta Pixel ya está inicializado');
      return;
    }

    try {
      // Cargar script de Meta Pixel
      !function(f,b,e,v,n,t,s) {
        if(f.fbq) return;
        n=f.fbq=function(){
          n.callMethod ?
          n.callMethod.apply(n,arguments) : n.queue.push(arguments)
        };
        if(!f._fbq) f._fbq=n;
        n.push=n;
        n.loaded=!0;
        n.version='2.0';
        n.queue=[];
        t=b.createElement(e);
        t.async=!0;
        t.src=v;
        s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      }(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', this.pixelId);
      window.fbq('track', 'PageView');

      this.isInitialized = true;
      console.log('✅ Meta Pixel inicializado correctamente:', this.pixelId);
    } catch (error) {
      console.error('❌ Error al inicializar Meta Pixel:', error);
    }
  }

  /**
   * Evento: Vista de contenido (producto)
   */
  trackViewContent(product) {
    if (!this.isInitialized) return;

    try {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'COP'
      });
      console.log('📊 Pixel: ViewContent -', product.name);
    } catch (error) {
      console.error('Error en trackViewContent:', error);
    }
  }

  /**
   * Evento: Agregar al carrito
   */
  trackAddToCart(product, quantity = 1) {
    if (!this.isInitialized) return;

    try {
      window.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price * quantity,
        currency: 'COP',
        quantity: quantity
      });
      console.log('📊 Pixel: AddToCart -', product.name, 'x', quantity);
    } catch (error) {
      console.error('Error en trackAddToCart:', error);
    }
  }

  /**
   * Evento: Iniciar checkout
   */
  trackInitiateCheckout(cartItems, totalValue) {
    if (!this.isInitialized) return;

    try {
      const contentIds = cartItems.map(item => item.id);
      const contents = cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }));

      window.fbq('track', 'InitiateCheckout', {
        content_ids: contentIds,
        contents: contents,
        content_type: 'product',
        value: totalValue,
        currency: 'COP',
        num_items: cartItems.length
      });
      console.log('📊 Pixel: InitiateCheckout - $', totalValue);
    } catch (error) {
      console.error('Error en trackInitiateCheckout:', error);
    }
  }

  /**
   * Evento: Agregar información de pago
   */
  trackAddPaymentInfo(paymentMethod) {
    if (!this.isInitialized) return;

    try {
      window.fbq('track', 'AddPaymentInfo', {
        payment_method: paymentMethod
      });
      console.log('📊 Pixel: AddPaymentInfo -', paymentMethod);
    } catch (error) {
      console.error('Error en trackAddPaymentInfo:', error);
    }
  }

  /**
   * Evento: Compra completada
   */
  trackPurchase(orderData) {
    if (!this.isInitialized) return;

    try {
      const contentIds = orderData.items.map(item => item.id);
      const contents = orderData.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        item_price: item.price
      }));

      window.fbq('track', 'Purchase', {
        content_ids: contentIds,
        contents: contents,
        content_type: 'product',
        value: orderData.total,
        currency: 'COP',
        num_items: orderData.items.length,
        transaction_id: orderData.orderId
      });
      console.log('🎉 Pixel: Purchase - Orden:', orderData.orderId, '- Total: $', orderData.total);
    } catch (error) {
      console.error('Error en trackPurchase:', error);
    }
  }

  /**
   * Evento: Búsqueda
   */
  trackSearch(searchQuery) {
    if (!this.isInitialized) return;

    try {
      window.fbq('track', 'Search', {
        search_string: searchQuery
      });
      console.log('📊 Pixel: Search -', searchQuery);
    } catch (error) {
      console.error('Error en trackSearch:', error);
    }
  }

  /**
   * Evento: Ver categoría
   */
  trackViewCategory(categoryName) {
    if (!this.isInitialized) return;

    try {
      window.fbq('trackCustom', 'ViewCategory', {
        category_name: categoryName
      });
      console.log('📊 Pixel: ViewCategory -', categoryName);
    } catch (error) {
      console.error('Error en trackViewCategory:', error);
    }
  }

  /**
   * Evento: Contacto (WhatsApp)
   */
  trackContact(method = 'whatsapp') {
    if (!this.isInitialized) return;

    try {
      window.fbq('track', 'Contact', {
        contact_method: method
      });
      console.log('📊 Pixel: Contact -', method);
    } catch (error) {
      console.error('Error en trackContact:', error);
    }
  }

  /**
   * Evento: Lead (registro)
   */
  trackLead(leadType = 'registration') {
    if (!this.isInitialized) return;

    try {
      window.fbq('track', 'Lead', {
        lead_type: leadType
      });
      console.log('📊 Pixel: Lead -', leadType);
    } catch (error) {
      console.error('Error en trackLead:', error);
    }
  }
}

// Exportar instancia única (Singleton)
const MetaPixel = new MetaPixelService();
export default MetaPixel;