// src/components/chatbot/ChatbotEngine.js

class ChatbotEngine {
  constructor(products = [], categories = [], orders = []) {
    this.products = products;
    this.categories = categories;
    this.orders = orders;
  }

  updateData(products, categories, orders) {
    this.products = products;
    this.categories = categories;
    this.orders = orders;
  }

  // 🧠 Analizar intención del usuario con palabras clave
  analyzeIntent(message) {
    const msg = message.toLowerCase().trim();

    // Saludos
    if (/^(hola|hi|hey|buenos dias|buenas tardes|buenas noches|saludos|ey)/i.test(msg)) {
      return { intent: 'greeting', confidence: 1 };
    }

    // Despedidas
    if (/^(adios|chao|hasta luego|bye|gracias|ok|vale|nos vemos)/i.test(msg)) {
      return { intent: 'goodbye', confidence: 1 };
    }

    // Búsqueda de productos
    if (/(busco|buscar|necesito|quiero|donde|venden|tienen|hay|precio|cuanto|cuesta|producto|mostrar)/i.test(msg)) {
      return { intent: 'search_product', confidence: 0.8, query: msg };
    }

    // Pedidos
    if (/(pedido|orden|compra|seguimiento|tracking|estado|envio|entrega)/i.test(msg)) {
      return { intent: 'order_status', confidence: 0.8 };
    }

    // Envíos
    if (/(envio|enviar|entrega|domicilio|courier|envian|tiempo de entrega|shipping|despacho)/i.test(msg)) {
      return { intent: 'shipping_info', confidence: 0.9 };
    }

    // Métodos de pago
    if (/(pago|pagar|tarjeta|efectivo|nequi|pse|bancolombia|transferencia|formas de pago|como pago)/i.test(msg)) {
      return { intent: 'payment_methods', confidence: 0.9 };
    }

    // Garantías
    if (/(garantia|garantía|devolucion|devolución|cambio|defecto|reparacion|warranty)/i.test(msg)) {
      return { intent: 'warranty_info', confidence: 0.9 };
    }

    // Horarios
    if (/(horario|hora|abierto|abren|cierran|atencion|disponible|cuando)/i.test(msg)) {
      return { intent: 'schedule', confidence: 0.9 };
    }

    // Ayuda
    if (/(ayuda|help|asistencia|soporte|contacto|asesor|humano|persona)/i.test(msg)) {
      return { intent: 'help', confidence: 0.9 };
    }

    // Carrito
    if (/(carrito|cart|bolsa|comprar|añadir|agregar)/i.test(msg)) {
      return { intent: 'cart', confidence: 0.8 };
    }

    return { intent: 'unknown', confidence: 0.5 };
  }

  // 💬 Generar respuesta según la intención
  generateResponse(intent, userData = null) {
    const responses = {
      greeting: {
        message: userData?.firstName 
          ? `¡Hola ${userData.firstName}! 👋\n\nSoy el asistente virtual de **mixxo**. Estoy aquí para ayudarte con cualquier consulta sobre productos, pedidos, envíos y más.\n\n¿En qué puedo ayudarte hoy?`
          : '¡Hola! 👋\n\nSoy el asistente virtual de **mixxo**. Estoy aquí para ayudarte con cualquier consulta sobre productos, pedidos, envíos y más.\n\n¿En qué puedo ayudarte hoy?',
        type: 'text',
        options: [
          { label: '🔍 Buscar productos', value: 'search' },
          { label: '📦 Ver mis pedidos', value: 'orders' },
          { label: '🚚 Información de envíos', value: 'shipping' },
          { label: '💳 Métodos de pago', value: 'payment' }
        ]
      },

      goodbye: {
        message: '¡Hasta pronto! 👋\n\nSi necesitas algo más, aquí estaré para ayudarte.\n\n¡Que tengas un excelente día! ✨',
        type: 'text'
      },

      shipping_info: {
        message: `📦 **Información de Envíos**\n\n🚚 **Envío Nacional**\n• Envío GRATIS en compras superiores a $200.000\n• Entrega en 24-48 horas en ciudades principales\n• Entrega en 3-5 días en otras ciudades\n\n📍 **Cobertura**\n• Cobertura nacional en Colombia\n• Seguimiento en tiempo real\n\n💰 **Costos**\n• Menos de $200.000: $15.000\n• Más de $200.000: GRATIS\n\n¿Necesitas más información?`,
        type: 'text',
        options: [
          { label: '📦 Ver mis pedidos', value: 'orders' },
          { label: '💬 Hablar con asesor', value: 'human' }
        ]
      },

      payment_methods: {
        message: `💳 **Métodos de Pago**\n\nAceptamos:\n\n💳 **Tarjetas de Crédito/Débito**\n• Visa, Mastercard, American Express\n• Pago seguro con Wompi\n\n🏦 **PSE**\n• Pago desde tu banco en línea\n• Confirmación inmediata\n\n📱 **Nequi**\n• Pago rápido desde tu app\n• Aprobación instantánea\n\n💵 **Efectivo**\n• Pago contra entrega\n• Disponible en algunas zonas\n\n🔒 Todos los pagos son 100% seguros`,
        type: 'text'
      },

      warranty_info: {
        message: `🛡️ **Garantías y Devoluciones**\n\n✅ **Garantía**\n• 12 meses de garantía en todos los productos\n• Cubre defectos de fabricación\n• Reparación o cambio sin costo\n\n↩️ **Devoluciones**\n• 30 días para devoluciones\n• Producto sin usar y con empaque original\n• Reembolso completo o cambio\n\n📝 **Proceso**\n1. Contacta con nosotros\n2. Envía el producto\n3. Recibe tu reembolso o cambio\n\n¿Tienes un producto con problemas?`,
        type: 'text',
        options: [
          { label: '💬 Contactar soporte', value: 'human' }
        ]
      },

      schedule: {
        message: `🕐 **Horarios de Atención**\n\n📱 **Servicio al Cliente**\n• Lunes a Viernes: 8:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM\n• Domingos y festivos: Cerrado\n\n💬 **Chat en línea**\n• Disponible 24/7\n\n📧 **Email**\n• Respuesta en menos de 24 horas\n• hola@mixxo.com\n\n¿En qué más puedo ayudarte?`,
        type: 'text'
      },

      help: {
        message: `🤖 **¿Cómo puedo ayudarte?**\n\nPuedo asistirte con:\n\n✅ Buscar productos\n✅ Estado de pedidos\n✅ Información de envíos\n✅ Métodos de pago\n✅ Garantías y devoluciones\n✅ Horarios de atención\n\nTambién puedes escribir tu pregunta y haré mi mejor esfuerzo para ayudarte.\n\n¿Qué necesitas?`,
        type: 'text',
        options: [
          { label: '🔍 Buscar productos', value: 'search' },
          { label: '📦 Mis pedidos', value: 'orders' },
          { label: '🚚 Info de envíos', value: 'shipping' },
          { label: '💬 Hablar con asesor', value: 'human' }
        ]
      },

      cart: {
        message: `🛒 **Carrito de Compras**\n\nPara ver tu carrito, haz clic en el ícono del carrito en la parte superior derecha de la página.\n\nDesde ahí podrás:\n• Ver todos tus productos\n• Modificar cantidades\n• Proceder al pago\n\n¿Necesitas ayuda con algo más?`,
        type: 'text'
      },

      order_status: {
        message: userData 
          ? `📦 **Estado de Pedidos**\n\nPara consultar tus pedidos, puedes:\n\n1️⃣ Ver la lista de pedidos abajo\n2️⃣ Hablar con un asesor en WhatsApp\n\n¿Qué prefieres?`
          : `📦 **Estado de Pedidos**\n\nPara consultar el estado de tu pedido necesitas iniciar sesión.\n\n¿Ya tienes una cuenta?`,
        type: 'text',
        options: userData 
          ? [
              { label: '📦 Ver mis pedidos', value: 'orders' },
              { label: '💬 Hablar con asesor', value: 'human' }
            ]
          : [
              { label: '🔐 Iniciar sesión', value: 'login' },
              { label: '💬 Hablar con asesor', value: 'human' }
            ]
      },

      unknown: {
        message: `Hmm, no estoy seguro de entender tu pregunta. 🤔\n\nPero puedo ayudarte con:\n• Buscar productos\n• Estado de pedidos\n• Información de envíos\n• Métodos de pago\n\n¿Podrías reformular tu pregunta o elegir una opción?`,
        type: 'text',
        options: [
          { label: '🔍 Buscar productos', value: 'search' },
          { label: '📦 Mis pedidos', value: 'orders' },
          { label: '💬 Hablar con un asesor', value: 'human' }
        ]
      }
    };

    return responses[intent.intent] || responses.unknown;
  }

  // 🔍 Buscar productos por texto
  searchProducts(query) {
    const q = query.toLowerCase();
    const results = this.products
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some(tag => tag.toLowerCase().includes(q))
      )
      .slice(0, 5);

    return results;
  }

  // 📦 Obtener pedidos del usuario
  getUserOrders(userId) {
    if (!userId) return [];
    return this.orders.filter(o => o.user_id === userId).slice(0, 5);
  }

  // 📊 Obtener estadísticas
  getStats() {
    return {
      totalProducts: this.products.length,
      totalCategories: Object.keys(this.categories).length,
      inStockProducts: this.products.filter(p => p.stockQuantity > 0).length
    };
  }
}

export default ChatbotEngine;