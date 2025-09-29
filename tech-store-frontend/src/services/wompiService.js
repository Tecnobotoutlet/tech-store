// src/services/wompiService.js - Integración completa con Wompi
const WOMPI_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://production.wompi.co/v1' 
    : 'https://sandbox.wompi.co/v1',
  
  publicKey: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_WOMPI_PUBLIC_KEY_PROD
    : process.env.REACT_APP_WOMPI_PUBLIC_KEY || 'pub_test_KaQFpojdIbESo6SVCqEVvidZd6bdCbC3',
  
  apiURL: process.env.REACT_APP_API_URL || 'http://localhost:3001'
};

class WompiService {
  constructor() {
    this.baseURL = WOMPI_CONFIG.baseURL;
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
   * Obtener información del merchant y token de aceptación
   */
  async getMerchantInfo() {
    try {
      const response = await fetch(`${this.baseURL}/merchants/${this.publicKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error obteniendo información del merchant');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error getting merchant info:', error);
      throw new Error('No se pudo obtener la información del merchant');
    }
  }

  /**
   * Tokenizar tarjeta de crédito
   */
  async tokenizeCard(cardData) {
    try {
      const tokenData = {
        number: cardData.number.replace(/\s/g, ''),
        cvc: cardData.cvc,
        exp_month: cardData.exp_month.padStart(2, '0'),
        exp_year: cardData.exp_year,
        card_holder: cardData.card_holder
      };

      const response = await fetch(`${this.baseURL}/tokens/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.publicKey}`
        },
        body: JSON.stringify(tokenData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Error tokenizando tarjeta');
      }

      return result.data;
    } catch (error) {
      console.error('Error tokenizing card:', error);
      throw error;
    }
  }

  /**
   * Crear transacción a través del backend (RECOMENDADO)
   */
  async createTransactionViaBackend(orderData) {
    try {
      const response = await fetch(`${this.apiURL}/api/wompi/create-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error creando transacción');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createTransactionViaBackend:', error);
      throw error;
    }
  }

  /**
   * Crear transacción directa (solo para desarrollo)
   */
  async createTransaction(transactionData) {
    try {
      const response = await fetch(`${this.baseURL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.publicKey}`
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Error procesando transacción');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Consultar estado de transacción
   */
  async getTransactionStatus(transactionId) {
    try {
      const response = await fetch(`${this.baseURL}/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.publicKey}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error('Error consultando estado de transacción');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting transaction status:', error);
      throw error;
    }
  }

  /**
   * Verificar transacción a través del backend
   */
  async checkTransactionStatus(transactionId) {
    try {
      const response = await fetch(`${this.apiURL}/api/wompi/transaction-status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
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
   * Procesar pago con tarjeta (Método principal)
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
      console.log('Starting card payment for reference:', reference);

      // 1. Obtener token de aceptación
      const merchantInfo = await this.getMerchantInfo();
      const acceptanceToken = merchantInfo.presigned_acceptance.acceptance_token;

      // 2. Tokenizar tarjeta
      const cardToken = await this.tokenizeCard(cardData);

      // 3. Crear transacción a través del backend
      const transaction = await this.createTransactionViaBackend({
        orderId,
        amount,
        currency,
        reference,
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'CARD',
          token: cardToken.id,
          installments: installments
        },
        acceptanceToken: acceptanceToken,
        customerData: {
          userId: customerData.userId,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          document: customerData.document,
          documentType: customerData.documentType || 'CC'
        },
        shippingAddress: {
          address: shippingAddress.address,
          addressDetails: shippingAddress.addressDetails,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          phone: shippingAddress.phone || customerData.phone
        }
      });

      return {
        success: transaction.success,
        transaction: transaction.transaction,
        reference: transaction.reference,
        status: transaction.transaction?.status,
        transactionId: transaction.transaction?.id
      };

    } catch (error) {
      console.error('Error processing card payment:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * Procesar pago con Nequi
   */
  async processNequiPayment({
    orderId,
    amount,
    phoneNumber,
    customerData,
    shippingAddress
  }) {
    try {
      const merchantInfo = await this.getMerchantInfo();
      const acceptanceToken = merchantInfo.presigned_acceptance.acceptance_token;

      const transaction = await this.createTransactionViaBackend({
        orderId,
        amount,
        currency: 'COP',
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'NEQUI',
          phone_number: phoneNumber
        },
        acceptanceToken: acceptanceToken,
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

      return transaction;
    } catch (error) {
      console.error('Error processing Nequi payment:', error);
      throw error;
    }
  }

  /**
   * Obtener bancos para PSE
   */
  async getPSEBanks() {
    try {
      const response = await fetch(`${this.baseURL}/pse/financial_institutions`, {
        headers: {
          'Authorization': `Bearer ${this.publicKey}`
        }
      });

      if (!response.ok) throw new Error('Error obteniendo bancos');

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error obteniendo bancos PSE:', error);
      return [];
    }
  }

  /**
   * Procesar pago con PSE
   */
  async processPSEPayment({
    orderId,
    amount,
    customerData,
    pseData,
    shippingAddress
  }) {
    try {
      const merchantInfo = await this.getMerchantInfo();
      const acceptanceToken = merchantInfo.presigned_acceptance.acceptance_token;

      const transaction = await this.createTransactionViaBackend({
        orderId,
        amount,
        currency: 'COP',
        customerEmail: customerData.email,
        paymentMethod: {
          type: 'PSE',
          user_type: pseData.userType, // 0 = Persona, 1 = Empresa
          user_legal_id_type: pseData.userLegalIdType, // CC, NIT, CE, etc
          user_legal_id: pseData.userLegalId,
          financial_institution_code: pseData.bankCode,
          payment_description: `Pedido #${orderId}`
        },
        acceptanceToken: acceptanceToken,
        customerData: {
          userId: customerData.userId,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          phone: customerData.phone,
          document: pseData.userLegalId,
          documentType: pseData.userLegalIdType
        },
        shippingAddress
      });

      return transaction;
    } catch (error) {
      console.error('Error processing PSE payment:', error);
      throw error;
    }
  }

  /**
   * Obtener métodos de pago disponibles
   */
  async getPaymentMethods() {
    try {
      const response = await fetch(`${this.baseURL}/payment_methods`, {
        headers: {
          'Authorization': `Bearer ${this.publicKey}`
        }
      });

      if (!response.ok) throw new Error('Error obteniendo métodos de pago');

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error obteniendo métodos de pago:', error);
      return [];
    }
  }

  /**
   * Procesar pago con tarjetas de prueba para sandbox
   */
  async processTestPayment(paymentData) {
    try {
      const testCards = {
        '4242424242424242': { status: 'APPROVED', type: 'visa' },
        '5555555555554444': { status: 'APPROVED', type: 'mastercard' },
        '4000000000000002': { status: 'DECLINED', type: 'visa' },
        '4000000000009995': { status: 'DECLINED', type: 'visa' }
      };

      const cardNumber = paymentData.cardData.number.replace(/\s/g, '');
      const testResult = testCards[cardNumber];

      if (testResult) {
        const reference = this.generateReference();
        
        return {
          success: testResult.status === 'APPROVED',
          status: testResult.status,
          reference,
          transactionId: `TXN_TEST_${Date.now()}`,
          message: testResult.status === 'APPROVED' 
            ? 'Pago procesado exitosamente' 
            : 'Pago rechazado',
          amount: paymentData.amount,
          currency: paymentData.currency || 'COP'
        };
      }

      // Si no es tarjeta de prueba, procesar normalmente
      return await this.processCardPayment(paymentData);

    } catch (error) {
      console.error('Error processing test payment:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * Validar datos de tarjeta
   */
  validateCardData(cardData) {
    const errors = {};

    if (!cardData.number || !this.isValidCardNumber(cardData.number.replace(/\s/g, ''))) {
      errors.number = 'Número de tarjeta inválido';
    }

    if (!cardData.exp_month || !cardData.exp_year) {
      errors.expiry = 'Fecha de vencimiento requerida';
    } else if (this.isCardExpired(cardData.exp_month, cardData.exp_year)) {
      errors.expiry = 'Tarjeta vencida';
    }

    if (!cardData.cvc || cardData.cvc.length < 3) {
      errors.cvc = 'CVC inválido';
    }

    if (!cardData.card_holder || cardData.card_holder.trim().length < 2) {
      errors.card_holder = 'Nombre del titular requerido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validar número de tarjeta con algoritmo Luhn
   */
  isValidCardNumber(number) {
    if (!/^\d{13,19}$/.test(number)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));

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
   * Verificar si la tarjeta está vencida
   */
  isCardExpired(month, year) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const expYear = parseInt(year);
    const expMonth = parseInt(month);

    if (expYear < currentYear) {
      return true;
    }

    if (expYear === currentYear && expMonth < currentMonth) {
      return true;
    }

    return false;
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
   * Obtener información de tarjetas de prueba
   */
  getTestCards() {
    return {
      success: [
        {
          number: '4242 4242 4242 4242',
          type: 'Visa',
          description: 'Pago exitoso',
          cvc: '123',
          expMonth: '12',
          expYear: '2025'
        },
        {
          number: '5555 5555 5555 4444',
          type: 'MasterCard',
          description: 'Pago exitoso',
          cvc: '123',
          expMonth: '12',
          expYear: '2025'
        }
      ],
      decline: [
        {
          number: '4000 0000 0000 0002',
          type: 'Visa',
          description: 'Tarjeta rechazada',
          cvc: '123',
          expMonth: '12',
          expYear: '2025'
        },
        {
          number: '4000 0000 0000 9995',
          type: 'Visa',
          description: 'Fondos insuficientes',
          cvc: '123',
          expMonth: '12',
          expYear: '2025'
        }
      ]
    };
  }

  /**
   * Generar firma de integridad (para desarrollo local)
   * NOTA: En producción esto DEBE hacerse en el backend
   */
  generateIntegritySignature(reference, amount) {
    const amountInCents = Math.round(amount * 100);
    const currency = 'COP';
    const timestamp = Date.now();
    
    // Firma simplificada para desarrollo
    return `${reference}${amountInCents}${currency}${timestamp}`;
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
}

// Instancia singleton
const wompiService = new WompiService();

export default wompiService;
export { WompiService };
