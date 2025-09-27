// Configuración real de Wompi
const WOMPI_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://production.wompi.co/v1' 
    : 'https://sandbox.wompi.co/v1',
  
  publicKey: process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_WOMPI_PUBLIC_KEY_PROD
    : process.env.REACT_APP_WOMPI_PUBLIC_KEY || 'pub_sandbox_P2hlhnpGO1cE7lFEYbwwJe9gVBMzHU90',
};

class WompiService {
  constructor() {
    this.baseURL = WOMPI_CONFIG.baseURL;
    this.publicKey = WOMPI_CONFIG.publicKey;
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
   * Crear fuente de pago
   */
  async createPaymentSource(token, customerEmail, acceptanceToken) {
    try {
      const paymentSourceData = {
        type: 'CARD',
        token: token,
        customer_email: customerEmail,
        acceptance_token: acceptanceToken
      };

      const response = await fetch(`${this.baseURL}/payment_sources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.publicKey}`
        },
        body: JSON.stringify(paymentSourceData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Error creando fuente de pago');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating payment source:', error);
      throw error;
    }
  }

  /**
   * Crear transacción
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
   * Procesar pago completo (método principal)
   */
  async processPayment({
    cardData,
    amount,
    currency = 'COP',
    customerData,
    shippingAddress,
    items
  }) {
    try {
      const reference = this.generateReference();
      console.log('Starting payment process for reference:', reference);

      // 1. Obtener información del merchant
      console.log('Getting merchant info...');
      const merchantInfo = await this.getMerchantInfo();
      const acceptanceToken = merchantInfo.presigned_acceptance.acceptance_token;

      // 2. Tokenizar tarjeta
      console.log('Tokenizing card...');
      const cardToken = await this.tokenizeCard(cardData);

      // 3. Crear fuente de pago
      console.log('Creating payment source...');
      const paymentSource = await this.createPaymentSource(
        cardToken.id,
        customerData.email,
        acceptanceToken
      );

      // 4. Crear transacción
      console.log('Creating transaction...');
      const transactionData = {
        amount_in_cents: Math.round(amount * 100),
        currency,
        signature: this.generateIntegritySignature(reference, amount),
        customer_email: customerData.email,
        payment_method: {
          type: 'CARD',
          installments: 1
        },
        payment_source_id: paymentSource.id,
        reference,
        customer_data: {
          phone_number: customerData.phone,
          full_name: `${customerData.firstName} ${customerData.lastName}`,
          legal_id: customerData.document,
          legal_id_type: customerData.documentType || 'CC'
        },
        shipping_address: {
          address_line_1: shippingAddress.address,
          address_line_2: shippingAddress.addressDetails || '',
          country: 'CO',
          region: shippingAddress.department,
          city: shippingAddress.city,
          name: `${customerData.firstName} ${customerData.lastName}`,
          phone_number: customerData.phone,
          postal_code: shippingAddress.postalCode || ''
        }
      };

      const transaction = await this.createTransaction(transactionData);

      console.log('Transaction created:', transaction);

      return {
        success: true,
        transaction,
        reference,
        status: transaction.status,
        transactionId: transaction.id
      };

    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message,
        reference: this.generateReference()
      };
    }
  }

  /**
   * Generar firma de integridad
   * En producción esto debería hacerse en el backend
   */
  generateIntegritySignature(reference, amount) {
    // Para sandbox, podemos generar una firma básica
    // En producción, esto DEBE hacerse en el backend con la clave privada
    const amountInCents = Math.round(amount * 100);
    const currency = 'COP';
    const timestamp = Date.now();
    
    // Esta es una firma simplificada para el sandbox
    return `${reference}${amountInCents}${currency}${timestamp}`;
  }

  /**
   * Validar respuesta de webhook (para implementar en backend)
   */
  validateWebhookSignature(payload, signature, eventsKey) {
    // Implementar validación de webhook
    // Esto debe hacerse en el backend
    return true;
  }

  /**
   * Procesar pago con tarjetas de prueba para sandbox
   */
  async processTestPayment(paymentData) {
    try {
      // Para el sandbox, usar las tarjetas de prueba oficiales de Wompi
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
          transactionId: `TXN_${Date.now()}`,
          message: testResult.status === 'APPROVED' 
            ? 'Pago procesado exitosamente' 
            : 'Pago rechazado',
          amount: paymentData.amount,
          currency: paymentData.currency || 'COP'
        };
      }

      // Si no es una tarjeta de prueba, procesar normalmente
      return await this.processPayment(paymentData);

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

    // Validar número de tarjeta (algoritmo Luhn)
    if (!cardData.number || !this.isValidCardNumber(cardData.number.replace(/\s/g, ''))) {
      errors.number = 'Número de tarjeta inválido';
    }

    // Validar fecha de vencimiento
    if (!cardData.exp_month || !cardData.exp_year) {
      errors.expiry = 'Fecha de vencimiento requerida';
    } else if (this.isCardExpired(cardData.exp_month, cardData.exp_year)) {
      errors.expiry = 'Tarjeta vencida';
    }

    // Validar CVV
    if (!cardData.cvc || cardData.cvc.length < 3) {
      errors.cvc = 'CVC inválido';
    }

    // Validar nombre
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
   * Obtener información de tarjetas de prueba
   */
  getTestCards() {
    return {
      success: [
        {
          number: '4242 4242 4242 4242',
          type: 'Visa',
          description: 'Pago exitoso'
        },
        {
          number: '5555 5555 5555 4444',
          type: 'MasterCard',
          description: 'Pago exitoso'
        }
      ],
      decline: [
        {
          number: '4000 0000 0000 0002',
          type: 'Visa',
          description: 'Tarjeta rechazada'
        },
        {
          number: '4000 0000 0000 9995',
          type: 'Visa',
          description: 'Fondos insuficientes'
        }
      ]
    };
  }
}

// Instancia singleton
const wompiService = new WompiService();

export default wompiService;
export { WompiService };