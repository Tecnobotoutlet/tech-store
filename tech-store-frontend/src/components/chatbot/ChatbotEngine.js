// src/components/chatbot/ChatbotEngine.js - PERSONALIZADO PARA MIXXO

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
    if (/^(hola|hi|hey|buenos dias|buenas tardes|buenas noches|saludos|ey|buenas|que tal)/i.test(msg)) {
      return { intent: 'greeting', confidence: 1 };
    }

    // Despedidas
    if (/^(adios|chao|hasta luego|bye|gracias|ok|vale|nos vemos|chau)/i.test(msg)) {
      return { intent: 'goodbye', confidence: 1 };
    }

    // Búsqueda de productos - CUALQUIER TEXTO QUE NO SEA COMANDO
    if (/(busco|buscar|necesito|quiero|donde|venden|tienen|hay|precio|cuanto|cuesta|producto|mostrar|ver)/i.test(msg)) {
      return { intent: 'search_product', confidence: 0.8, query: msg };
    }

    // Pedidos
    if (/(pedido|orden|compra|seguimiento|tracking|estado|mis pedidos)/i.test(msg)) {
      return { intent: 'order_status', confidence: 0.8 };
    }

    // Envíos - PERSONALIZADO
    if (/(envio|enviar|entrega|domicilio|courier|envian|tiempo de entrega|shipping|despacho|contraentrega|contra entrega)/i.test(msg)) {
      return { intent: 'shipping_info', confidence: 0.9 };
    }

    // Métodos de pago - PERSONALIZADO
    if (/(pago|pagar|tarjeta|efectivo|nequi|pse|bancolombia|credito|debito|formas de pago|como pago|metodos de pago)/i.test(msg)) {
      return { intent: 'payment_methods', confidence: 0.9 };
    }

    // Garantías - PERSONALIZADO
    if (/(garantia|garantía|devolucion|devolución|cambio|defecto|reparacion|warranty|problema|falla|dañado)/i.test(msg)) {
      return { intent: 'warranty_info', confidence: 0.9 };
    }

    // Horarios - PERSONALIZADO
    if (/(horario|hora|abierto|abren|cierran|atencion|disponible|cuando|trabajan|abre|cierra)/i.test(msg)) {
      return { intent: 'schedule', confidence: 0.9 };
    }

    // Ayuda
    if (/(ayuda|help|asistencia|soporte|contacto|asesor|humano|persona|hablar)/i.test(msg)) {
      return { intent: 'help', confidence: 0.9 };
    }

    // Carrito
    if (/(carrito|cart|bolsa|comprar|añadir|agregar)/i.test(msg)) {
      return { intent: 'cart', confidence: 0.8 };
    }

    // Ubicación
    if (/(ubicacion|ubicación|donde estan|direccion|dirección|local|tienda fisica)/i.test(msg)) {
      return { intent: 'location', confidence: 0.9 };
    }

    // Preguntas frecuentes
    if (/(faq|preguntas|frecuentes|dudas|info|información)/i.test(msg)) {
      return { intent: 'faq', confidence: 0.8 };
    }

    // Si no es ningún comando específico, intentar buscar productos
    if (msg.length > 2) {
      return { intent: 'search_product', confidence: 0.6, query: msg };
    }

    return { intent: 'unknown', confidence: 0.5 };
  }

  // 💬 Generar respuesta según la intención - PERSONALIZADO
  generateResponse(intent, userData = null) {
    const responses = {
      greeting: {
        message: userData?.firstName 
          ? `¡Hola ${userData.firstName}! 👋\n\nBienvenido a **mixxo**, tu tienda de confianza. Estoy aquí para ayudarte a encontrar lo que necesitas.\n\n¿En qué puedo ayudarte hoy?`
          : '¡Hola! 👋\n\nBienvenido a **mixxo**, tu tienda de confianza. Estoy aquí para ayudarte a encontrar exactamente lo que buscas.\n\n¿Qué necesitas hoy?',
        type: 'text',
        options: [
          { label: '🔍 Buscar productos', value: 'search' },
          { label: '📦 Ver mis pedidos', value: 'orders' },
          { label: '🚚 Info de envíos', value: 'shipping' },
          { label: '💳 Métodos de pago', value: 'payment' }
        ]
      },

      goodbye: {
        message: '¡Hasta pronto! 👋\n\nGracias por visitar **mixxo**. Si necesitas algo más, aquí estaré para ayudarte.\n\n¡Que tengas un excelente día! ✨',
        type: 'text'
      },

      // 🚚 ENVÍOS - PERSONALIZADO MIXXO
      shipping_info: {
        message: `📦 **Información de Envíos mixxo**\n\n🚚 **Contraentrega**\n• Disponible en ciudades principales\n• Paga cuando recibes tu pedido\n• Sin costo adicional en compras mayores a $200.000\n\n📍 **Envío Nacional**\n• Cobertura en toda Colombia\n• Costo adicional según la zona\n• GRATIS en compras superiores a $200.000\n\n⏱️ **Tiempos de Entrega**\n• Ciudades principales: 2-4 días\n• Otras zonas: 5-8 días\n\n💰 **Costos**\n• Depende de tu ubicación\n• Gratis en compras mayores a $200.000\n\n¿Necesitas calcular el envío a tu zona?`,
        type: 'text',
        options: [
          { label: '📱 Consultar envío por WhatsApp', value: 'human' },
          { label: '🔍 Buscar productos', value: 'search' }
        ]
      },

      // 💳 MÉTODOS DE PAGO - PERSONALIZADO MIXXO
      payment_methods: {
        message: `💳 **Métodos de Pago en mixxo**\n\nAceptamos las siguientes formas de pago:\n\n💳 **Tarjeta de Crédito**\n• Visa, Mastercard, American Express\n• Pago seguro con Wompi\n• Aprobación inmediata\n\n🏦 **PSE**\n• Pago desde tu banco en línea\n• Todas las entidades bancarias\n• Confirmación instantánea\n\n📱 **Nequi**\n• Pago rápido desde tu app\n• Aprobación en segundos\n• 100% seguro\n\n💵 **Contraentrega**\n• Paga cuando recibes\n• Efectivo o datáfono\n• Disponible en ciudades principales\n\n🔒 Todos los pagos son 100% seguros y protegidos`,
        type: 'text'
      },

      // 🛡️ GARANTÍAS - PERSONALIZADO MIXXO
      warranty_info: {
        message: `🛡️ **Garantías y Devoluciones**\n\n¿Tienes un problema con tu producto?\n\n📱 **Contáctanos por WhatsApp**\nNuestro equipo te ayudará con:\n\n✅ Garantías de productos\n✅ Cambios y devoluciones\n✅ Productos defectuosos\n✅ Cualquier inconveniente\n\n⏰ **Atención Inmediata**\nDe lunes a sábado de 8:00 AM a 6:00 PM\n\n¿Quieres hablar con un asesor ahora?`,
        type: 'text',
        options: [
          { label: '💬 Contactar por WhatsApp', value: 'human' },
          { label: '🏠 Volver al menú', value: 'greeting' }
        ]
      },

      // 🕐 HORARIOS - PERSONALIZADO MIXXO
      schedule: {
        message: `🕐 **Horarios de Atención mixxo**\n\n📱 **Atención al Cliente**\n• Lunes a Sábado: 8:00 AM - 6:00 PM\n• Domingos: Cerrado\n\n💬 **Chat en línea**\n• Disponible en horario de atención\n\n📧 **Email**\n• hola@mixxo.com\n• Respuesta en 24 horas\n\n📞 **WhatsApp**\n• Respuesta rápida en horario de atención\n\n¿Necesitas ayuda con algo más?`,
        type: 'text',
        options: [
          { label: '💬 Contactar ahora', value: 'human' },
          { label: '🔍 Buscar productos', value: 'search' }
        ]
      },

      // ❓ FAQ - PREGUNTAS FRECUENTES
      faq: {
        message: `❓ **Preguntas Frecuentes**\n\n🔸 **¿Cómo comprar?**\nAgrega productos al carrito y procede al pago\n\n🔸 **¿Cuánto demora el envío?**\n2-4 días ciudades principales, 5-8 días otras zonas\n\n🔸 **¿Puedo pagar contraentrega?**\nSí, en ciudades principales\n\n🔸 **¿Tienen garantía los productos?**\nSí, contáctanos por WhatsApp para más información\n\n🔸 **¿Cómo rastreo mi pedido?**\nDesde tu perfil en "Mis Pedidos"\n\n¿Tienes otra pregunta?`,
        type: 'text',
        options: [
          { label: '📦 Ver mis pedidos', value: 'orders' },
          { label: '💬 Hablar con asesor', value: 'human' },
          { label: '🏠 Volver al inicio', value: 'greeting' }
        ]
      },

      // 📍 UBICACIÓN
      location: {
        message: `📍 **Ubicación de mixxo**\n\n🏢 **Tienda Online**\nSomos una tienda 100% virtual\n\n📦 **Envíos**\nEnviamos a toda Colombia\n\n📱 **Contacto**\nWhatsApp: +57 314 450 5320\nEmail: hola@mixxo.com\n\n¿Quieres consultar algo más?`,
        type: 'text',
        options: [
          { label: '💬 Contactar por WhatsApp', value: 'human' },
          { label: '🔍 Ver productos', value: 'search' }
        ]
      },

      // 🆘 AYUDA
      help: {
        message: `🤖 **¿Cómo puedo ayudarte?**\n\nPuedo asistirte con:\n\n✅ Buscar productos\n✅ Estado de pedidos\n✅ Información de envíos\n✅ Métodos de pago\n✅ Garantías y devoluciones\n✅ Horarios de atención\n✅ Preguntas frecuentes\n\n**Escribe lo que necesitas** o selecciona una opción:`,
        type: 'text',
        options: [
          { label: '🔍 Buscar productos', value: 'search' },
          { label: '📦 Mis pedidos', value: 'orders' },
          { label: '🚚 Info de envíos', value: 'shipping' },
          { label: '💬 Hablar con asesor', value: 'human' }
        ]
      },

      // 🛒 CARRITO
      cart: {
        message: `🛒 **Carrito de Compras**\n\nPara ver tu carrito, haz clic en el ícono del carrito 🛒 en la parte superior derecha.\n\nDesde ahí podrás:\n• Ver todos tus productos\n• Modificar cantidades\n• Aplicar cupones\n• Proceder al pago\n\n¿Necesitas ayuda con algo más?`,
        type: 'text',
        options: [
          { label: '🔍 Seguir comprando', value: 'search' },
          { label: '💳 Métodos de pago', value: 'payment' }
        ]
      },

      // 📦 ESTADO DE PEDIDOS
      order_status: {
        message: userData 
          ? `📦 **Estado de Pedidos**\n\nPara consultar tus pedidos:\n\n1️⃣ Revisa la sección "Mis Pedidos" abajo\n2️⃣ Contacta por WhatsApp con tu número de orden\n\n¿Qué prefieres?`
          : `📦 **Estado de Pedidos**\n\nPara consultar el estado de tu pedido necesitas:\n\n1️⃣ Iniciar sesión en tu cuenta\n2️⃣ Contactar por WhatsApp con tu número de orden\n\n¿Qué deseas hacer?`,
        type: 'text',
        options: userData 
          ? [
              { label: '📦 Ver mis pedidos', value: 'orders' },
              { label: '💬 Contactar por WhatsApp', value: 'human' }
            ]
          : [
              { label: '🔐 Iniciar sesión', value: 'login' },
              { label: '💬 Contactar por WhatsApp', value: 'human' }
            ]
      },

      // ❓ DESCONOCIDO
      unknown: {
        message: `Hmm, no estoy seguro de entender. 🤔\n\nPero puedo ayudarte con:\n\n• 🔍 Buscar productos (escribe lo que buscas)\n• 📦 Estado de pedidos\n• 🚚 Información de envíos\n• 💳 Métodos de pago\n\n**Escribe lo que necesitas** o selecciona una opción:`,
        type: 'text',
        options: [
          { label: '🔍 Buscar productos', value: 'search' },
          { label: '📦 Mis pedidos', value: 'orders' },
          { label: '💬 Hablar con asesor', value: 'human' }
        ]
      }
    };

    return responses[intent.intent] || responses.unknown;
  }

  // 🔍 Buscar productos por texto - MEJORADO
  searchProducts(query) {
    const q = query.toLowerCase();
    
    // Limpiar palabras comunes de búsqueda
    const cleanQuery = q
      .replace(/\b(busco|buscar|necesito|quiero|donde|venden|tienen|hay|precio|cuanto|cuesta|producto|mostrar|ver)\b/g, '')
      .trim();

    if (!cleanQuery) return [];

    const results = this.products
      .filter(p =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.brand?.toLowerCase().includes(cleanQuery) ||
        p.categoryName?.toLowerCase().includes(cleanQuery) ||
        p.category?.toLowerCase().includes(cleanQuery) ||
        p.description?.toLowerCase().includes(cleanQuery) ||
        p.tags?.some(tag => tag.toLowerCase().includes(cleanQuery))
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
