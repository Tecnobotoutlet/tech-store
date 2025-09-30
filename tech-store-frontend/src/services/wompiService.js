// src/services/wompiService.js - Versión mejorada con seguridad
const WOMPI_CONFIG = {
  // La llave pública es la única que va en el frontend
  publicKey: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_WOMPI_PUBLIC_KEY_PROD
    : 'pub_test_KaQFpojdIbESo6SVCqEVvidZd6bdCbC3',
  
  // SIEMPRE usar el backend para transacciones (nunca directo a Wompi)
  apiURL: process.env.REACT_APP_API_URL || 'http://localhost:3001'
};

class WompiService {
  constructor() {
    this.publicKey = WOMPI_CONFIG.publicKey;
    this.apiURL = WOMPI_CONFIG.apiURL;
  }

  /**
   * Generar referencia única
   */
  generateReference() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `TECHSTORE_${timestamp}_${randomStr}`;
  }

  /**
   * Obtener token de aceptación desde el backend (MÁS SEGURO)
   */
  async getAcceptanceToken() {
    try {
      const response = await fetch(`${this.apiURL}/api/wompi/acceptance-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo token de aceptación');
      }

      const result = await response.json();
      return result.acceptanceToken;
    } catch (error) {
      console.error('Error getting acceptance token:', error);
      throw new Error('No se pudo obtener el token de aceptación');
    }
  }

  /**
   * Crear transacción a través del backend (MÉTODO PRINCIPAL - MÁS SEGURO)
   */
  async createTransaction(transactionData) {
    try {
      const response = await fetch(`${this.apiURL}/api/wompi/create-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creando transacción');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createTransaction:', error);
      throw error;
    }
  }

  /**
   * Consultar estado de transacción
   */
  async getTransactionStatus(transactionId) {
    try {
      const response = await fetch(`${this.apiURL}/api/wompi/transaction-status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error verificando estado');

      return await response.json();
    } catch (error) {
      console.error('Error verificando transacción:', error);
      throw error;
    }
  }

  /**
   * ============================================
   * MÉTODO 1: PAGO CON TARJETA
   * ============================================
   */
  async processCardPayment({
    orderId,
    amount,
    currency = 'COP',
    cardData,
    customerData,
    shippingAddress,
    installments = 1
  }) {
    try {
      const reference = this.generateReference();
      console.log('💳 Procesando pago con tarjeta:', reference);

      // Obtener token de aceptación
      const acceptanceToken = await this.getAcceptanceToken();

      // Crear transacción vía backend
      const result = await this.createTransaction({
        orderId,
        amount,
        currency,
        reference,
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'CARD',
          token: cardData.token || cardData.number, // Si ya está tokenizado o es número
          installments: installments
        },
        acceptanceToken,
        customerData: {
          userId: customerData.userId,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          document: customerData.document,
          documentType: customerData.documentType || 'CC'
        },
        shippingAddress
      });

      return {
        success: result.success,
        transaction: result.transaction,
        reference: result.reference,
        status: result.status,
        transactionId: result.transaction?.id,
        paymentUrl: result.paymentUrl
      };

    } catch (error) {
      console.error('❌ Error procesando tarjeta:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * ============================================
   * MÉTODO 2: PAGO CON NEQUI
   * ============================================
   */
  async processNequiPayment({
    orderId,
    amount,
    phoneNumber,
    customerData,
    shippingAddress
  }) {
    try {
      const reference = this.generateReference();
      console.log('📱 Procesando pago con Nequi:', reference);

      const acceptanceToken = await this.getAcceptanceToken();

      const result = await this.createTransaction({
        orderId,
        amount,
        currency: 'COP',
        reference,
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'NEQUI',
          phone_number: phoneNumber
        },
        acceptanceToken,
        customerData: {
          userId: customerData.userId,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: phoneNumber,
          document: customerData.document,
          documentType: customerData.documentType || 'CC'
        },
        shippingAddress
      });

      return {
        success: result.success,
        transaction: result.transaction,
        reference: result.reference,
        status: result.status,
        paymentUrl: result.paymentUrl, // URL para completar pago en Nequi
        transactionId: result.transaction?.id
      };

    } catch (error) {
      console.error('❌ Error procesando Nequi:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * ============================================
   * MÉTODO 3: PAGO CON PSE (Bancos)
   * ============================================
   */
  async processPSEPayment({
    orderId,
    amount,
    customerData,
    pseData,
    shippingAddress
  }) {
    try {
      const reference = this.generateReference();
      console.log('🏦 Procesando pago con PSE:', reference);

      const acceptanceToken = await this.getAcceptanceToken();

      const result = await this.createTransaction({
        orderId,
        amount,
        currency: 'COP',
        reference,
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'PSE',
          user_type: pseData.userType, // 0 = Persona, 1 = Empresa
          user_legal_id_type: pseData.documentType,
          user_legal_id: pseData.document,
          financial_institution_code: pseData.bankCode,
          payment_description: `Pedido #${orderId} - TechStore`
        },
        acceptanceToken,
        customerData: {
          userId: customerData.userId,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          document: pseData.document,
          documentType: pseData.documentType
        },
        shippingAddress
      });

      return {
        success: result.success,
        transaction: result.transaction,
        reference: result.reference,
        status: result.status,
        paymentUrl: result.paymentUrl, // URL del banco para completar pago
        transactionId: result.transaction?.id
      };

    } catch (error) {
      console.error('❌ Error procesando PSE:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * ============================================
   * MÉTODO 4: PAGO CON BANCOLOMBIA (Botón o Transferencia)
   * ============================================
   */
  async processBancolombiaPayment({
    orderId,
    amount,
    customerData,
    shippingAddress
  }) {
    try {
      const reference = this.generateReference();
      console.log('🏦 Procesando pago con Bancolombia:', reference);

      const acceptanceToken = await this.getAcceptanceToken();

      const result = await this.createTransaction({
        orderId,
        amount,
        currency: 'COP',
        reference,
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'BANCOLOMBIA_TRANSFER',
          user_type: 0, // Persona natural
          user_legal_id: customerData.document,
          user_legal_id_type: customerData.documentType,
          payment_description: `Pedido #${orderId} - TechStore`
        },
        acceptanceToken,
        customerData,
        shippingAddress
      });

      return {
        success: result.success,
        transaction: result.transaction,
        reference: result.reference,
        status: result.status,
        paymentUrl: result.paymentUrl,
        transactionId: result.transaction?.id
      };

    } catch (error) {
      console.error('❌ Error procesando Bancolombia:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * Obtener lista de bancos PSE
   */
  async getPSEBanks() {
    try {
      const response = await fetch('https://production.wompi.co/v1/pse/financial_institutions', {
        headers: {
          'Authorization': `Bearer ${this.publicKey}`
        }
      });

      if (!response.ok) throw new Error('Error obteniendo bancos');

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error obteniendo bancos PSE:', error);
      return this.getDefaultPSEBanks(); // Fallback
    }
  }

  /**
   * Bancos PSE más comunes (fallback)
   */
  getDefaultPSEBanks() {
    return [
      { financial_institution_code: '1007', financial_institution_name: 'BANCOLOMBIA' },
      { financial_institution_code: '1012', financial_institution_name: 'BANCO DE BOGOTA' },
      { financial_institution_code: '1013', financial_institution_name: 'BBVA COLOMBIA' },
      { financial_institution_code: '1022', financial_institution_name: 'BANCO ITAU' },
      { financial_institution_code: '1040', financial_institution_name: 'BANCO AGRARIO' },
      { financial_institution_code: '1051', financial_institution_name: 'DAVIVIENDA' },
      { financial_institution_code: '1052', financial_institution_name: 'BANCO AV VILLAS' },
      { financial_institution_code: '1062', financial_institution_name: 'BANCO FALABELLA' },
      { financial_institution_code: '1063', financial_institution_name: 'BANCO FINANDINA' },
      { financial_institution_code: '1283', financial_institution_name: 'NEQUI' },
      { financial_institution_code: '1009', financial_institution_name: 'CITIBANK' },
      { financial_institution_code: '1019', financial_institution_name: 'SCOTIABANK COLPATRIA' }
    ];
  }

  /**
   * Validar datos de tarjeta con algoritmo Luhn
   */
  isValidCardNumber(number) {
    const cleaned = number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Detectar tipo de tarjeta
   */
  getCardType(number) {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    
    return 'unknown';
  }

  /**
   * Formatear número de tarjeta
   */
  formatCardNumber(number) {
    const cleaned = number.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  }

  /**
   * Formatear teléfono colombiano
   */
  formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  }

  /**
   * Formatear monto para Wompi (centavos)
   */
  formatAmountForWompi(amount) {
    return Math.round(amount * 100);
  }

  /**
   * Formatear monto desde Wompi (de centavos a pesos)
   */
  formatAmountFromWompi(amountInCents) {
    return amountInCents / 100;
  }

  /**
   * Obtener métodos de pago disponibles
   */
  getAvailablePaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Tarjeta de Crédito/Débito',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        enabled: true
      },
      {
        id: 'nequi',
        name: 'Nequi',
        icon: '📱',
        description: 'Pago desde tu cuenta Nequi',
        enabled: true
      },
      {
        id: 'pse',
        name: 'PSE',
        icon: '🏦',
        description: 'Pago desde tu banco',
        enabled: true
      },
      {
        id: 'bancolombia',
        name: 'Bancolombia',
        icon: '🔵',
        description: 'Transferencia Bancolombia',
        enabled: true
      }
    ];
  }
}

// Instancia singleton
const wompiService = new WompiService();

export default wompiService;
export { WompiService };
