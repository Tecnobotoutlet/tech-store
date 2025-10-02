import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-JSON']
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.sendStatus(200);
});

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

const wompiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Límite de transacciones excedido, intenta en unos minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/products', publicLimiter);
app.use('/api/wompi/create-transaction', wompiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// =====================
// RUTAS DE PRODUCTOS
// =====================

app.get('/api/products', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: products || [],
      count: products?.length || 0
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener producto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const {
      name, description, price, original_price, category, category_name,
      subcategory, subcategory_name, brand, model, stock, stock_quantity,
      image, images, is_active, is_featured, is_new, in_stock, discount,
      rating, reviews, total_reviews, tags, warranty, shipping,
      specifications, features, variants
    } = req.body;

    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        success: false,
        error: 'Campos requeridos: name, description, price, category, brand'
      });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        price,
        original_price: original_price || null,
        category,
        category_name: category_name || category,
        subcategory: subcategory || category,
        subcategory_name: subcategory_name || category_name || category,
        brand,
        model: model || null,
        stock: stock || stock_quantity || 0,
        stock_quantity: stock_quantity || stock || 0,
        image: image || null,
        images: images || [],
        is_active: is_active !== false,
        is_featured: is_featured || false,
        is_new: is_new || false,
        in_stock: in_stock !== false,
        discount: discount || 0,
        rating: rating || 4.5,
        reviews: reviews || 0,
        total_reviews: total_reviews || 0,
        tags: tags || [],
        warranty: warranty || '12 meses de garantía',
        shipping: shipping || 'Envío gratis en 24-48 horas',
        specifications: specifications || [],
        features: features || [],
        variants: variants || []
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear producto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updated_at: new Date().toISOString() };

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar producto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: product, error } = await supabase
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('is_active', true)
      .select('id, name')
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: product
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar producto',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// =====================
// RUTAS DE WOMPI
// =====================

app.get('/api/wompi/acceptance-token', async (req, res) => {
  try {
    const response = await fetch('https://production.wompi.co/v1/merchants/' + process.env.WOMPI_PUBLIC_KEY);
    const data = await response.json();
    
    if (data.data?.presigned_acceptance) {
      res.json({
        success: true,
        acceptanceToken: data.data.presigned_acceptance.acceptance_token,
        permalink: data.data.presigned_acceptance.permalink
      });
    } else {
      throw new Error('No se pudo obtener el token de aceptación');
    }
  } catch (error) {
    console.error('Error getting acceptance token:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo token de aceptación'
    });
  }
});

app.post('/api/wompi/create-transaction', async (req, res) => {
  try {
    const {
      orderId,
      amount,
      currency = 'COP',
      reference,
      customerEmail,
      paymentMethod,
      acceptanceToken,
      customerData,
      shippingAddress
    } = req.body;

    if (!orderId || !amount || !customerEmail || !paymentMethod || !acceptanceToken || !reference) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos incompletos',
        message: 'Faltan campos requeridos'
      });
    }

    const amountInCents = Math.round(amount);
    if (amountInCents < 150000) {
      return res.status(400).json({
        success: false,
        error: 'Monto inválido',
        message: 'El monto mínimo para transacciones es $1,500 COP'
      });
    }

    const integrityString = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(integrityString).digest('hex');

    const transactionData = {
      amount_in_cents: amountInCents,
      currency: currency,
      signature: integritySignature,
      customer_email: customerEmail,
      reference: reference,
      payment_method: paymentMethod,
      acceptance_token: acceptanceToken,
      customer_data: {
        phone_number: customerData?.phone || '',
        full_name: `${customerData?.firstName || ''} ${customerData?.lastName || ''}`.trim(),
        legal_id: customerData?.document || '',
        legal_id_type: customerData?.documentType || 'CC'
      },
      redirect_url: `${process.env.FRONTEND_URL}/payment-result?reference=${reference}`
    };

    if (shippingAddress && shippingAddress.address) {
      const addressData = {
        address_line_1: shippingAddress.address,
        city: shippingAddress.city,
        region: shippingAddress.state || shippingAddress.city,
        country: 'CO',
        phone_number: shippingAddress.phone || customerData?.phone || ''
      };

      if (shippingAddress.addressDetails && shippingAddress.addressDetails.trim().length >= 4) {
        addressData.address_line_2 = shippingAddress.addressDetails.trim();
      } else {
        addressData.address_line_2 = 'N/A ';
      }

      if (shippingAddress.postalCode && shippingAddress.postalCode.trim().length >= 5) {
        addressData.postal_code = shippingAddress.postalCode.trim().substring(0, 12);
      } else {
        addressData.postal_code = '00000';
      }

      transactionData.shipping_address = addressData;
    }

    console.log('Creating Wompi transaction:', {
      reference,
      amount: amountInCents,
      method: paymentMethod.type,
      email: customerEmail
    });

    const wompiResponse = await fetch(`${process.env.WOMPI_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
      },
      body: JSON.stringify(transactionData)
    });

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
      console.error('Wompi API error completo:', JSON.stringify(wompiData, null, 2));
      
      let errorMessage = 'Error creando transacción en Wompi';
      
      if (wompiData.error) {
        if (wompiData.error.reason) {
          errorMessage = wompiData.error.reason;
        } else if (wompiData.error.messages) {
          errorMessage = Array.isArray(wompiData.error.messages) 
            ? wompiData.error.messages.join(', ')
            : JSON.stringify(wompiData.error.messages);
        } else if (wompiData.error.message) {
          errorMessage = wompiData.error.message;
        }
      }
      
      throw new Error(errorMessage);
    }

    console.log('Wompi transaction created:', wompiData.data.id);

    // PARA PSE: Consultar la transacción para obtener la URL de pago
    if (paymentMethod.type === 'PSE' && wompiData.data.status === 'PENDING') {
      console.log('PSE PENDING - Consultando transacción para obtener URL...');
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const txStatusResponse = await fetch(
          `${process.env.WOMPI_API_URL}/transactions/${wompiData.data.id}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
            }
          }
        );
        
        const txStatus = await txStatusResponse.json();
        console.log('Estado de transacción PSE:', JSON.stringify(txStatus, null, 2));
        
        if (txStatus.data) {
          wompiData.data = { ...wompiData.data, ...txStatus.data };
        }
      } catch (error) {
        console.error('Error consultando estado de transacción PSE:', error);
      }
    }

    console.log('=== WOMPI RESPONSE DEBUG ===');
    console.log('Full response:', JSON.stringify(wompiData, null, 2));
    console.log('Status:', wompiData.data?.status);
    console.log('Payment Method Type:', paymentMethod.type);
    console.log('payment_link_url:', wompiData.data?.payment_link_url);
    console.log('payment_method:', JSON.stringify(wompiData.data?.payment_method, null, 2));
    console.log('===========================');

    let paymentUrl = null;

    if (paymentMethod.type === 'PSE') {
      paymentUrl = wompiData.data.payment_link_url || 
                   wompiData.data.payment_method?.extra?.async_payment_url ||
                   wompiData.data.payment_method?.extra?.payment_url;
      
      console.log('PSE Payment URL extraída:', paymentUrl);
      
      if (!paymentUrl) {
        console.error('❌ No se encontró payment URL en la respuesta de Wompi para PSE');
        console.error('Estructura completa de data:', JSON.stringify(wompiData.data, null, 2));
      }
    } else if (paymentMethod.type === 'NEQUI') {
      paymentUrl = wompiData.data.payment_method?.extra?.async_payment_url;
      
      console.log('NEQUI Payment URL extraída:', paymentUrl);
      
      if (!paymentUrl) {
        console.error('❌ No se encontró payment URL en la respuesta de Wompi para NEQUI');
      }
    } else if (paymentMethod.type === 'BANCOLOMBIA_TRANSFER') {
      paymentUrl = wompiData.data.payment_method?.extra?.async_payment_url;
      
      console.log('BANCOLOMBIA Payment URL extraída:', paymentUrl);
      
      if (!paymentUrl) {
        console.error('❌ No se encontró payment URL en la respuesta de Wompi para BANCOLOMBIA');
      }
    }

    console.log('Payment URL extracted:', {
      method: paymentMethod.type,
      url: paymentUrl,
      hasUrl: !!paymentUrl,
      status: wompiData.data.status
    });

    if (paymentMethod.type === 'PSE' && !paymentUrl) {
  console.error('CRITICAL ERROR: PSE requiere URL pero no fue encontrada');
  throw new Error('No se pudo obtener la URL de pago del banco. Por favor intenta nuevamente.');
}

// Para Nequi/Bancolombia, la URL es opcional (push notification)
if (!paymentUrl && ['NEQUI', 'BANCOLOMBIA_TRANSFER'].includes(paymentMethod.type)) {
  console.log(`⚠️ ${paymentMethod.type} sin URL - usando notificación push`);
}

    try {
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          order_id: orderId,
          user_id: customerData?.userId || null,
          wompi_transaction_id: wompiData.data.id,
          wompi_reference: reference,
          amount: amountInCents / 100,
          currency: currency,
          status: wompiData.data.status,
          payment_method_type: paymentMethod.type,
          customer_email: customerEmail,
          customer_data: customerData,
          wompi_data: wompiData.data
        }]);

      if (transactionError) throw transactionError;

      const orderStatus = wompiData.data.status === 'APPROVED' ? 'paid' : 'pending';
      
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          payment_status: orderStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      console.log('Transaction saved to database');
    } catch (dbError) {
      console.error('Error guardando en DB:', dbError);
    }

    return res.status(200).json({
      success: true,
      transaction: wompiData.data,
      reference: reference,
      transactionId: wompiData.data.id,
      paymentUrl: paymentUrl,
      status: wompiData.data.status
    });

  } catch (error) {
    console.error('Error en create-transaction:', error);
    return res.status(500).json({
      success: false,
      error: 'Error procesando pago',
      message: error.message
    });
  }
});

app.get('/api/wompi/transaction-status/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `${process.env.WOMPI_API_URL}/transactions/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Error consultando estado de transacción');
    }

    res.json({
      success: true,
      ...data.data
    });
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando estado de transacción'
    });
  }
});

app.post('/api/wompi/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-event-signature'];
    const eventData = req.body;

    console.log('Webhook received:', {
      event: eventData.event,
      transactionId: eventData.data?.transaction?.id,
      hasSignature: !!signature
    });

    if (signature) {
      const bodyString = JSON.stringify(eventData);
      const expectedSignature = crypto
        .createHash('sha256')
        .update(`${bodyString}${process.env.WOMPI_EVENTS_SECRET}`)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('Webhook signature validated');
    } else {
      console.warn('Webhook sin firma - rechazado en producción');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const { event, data } = eventData;
    const transaction = data.transaction;

    if (!transaction) {
      return res.status(400).json({ error: 'No transaction data' });
    }

    console.log('Processing webhook:', {
      event,
      transactionId: transaction.id,
      status: transaction.status,
      reference: transaction.reference
    });

    try {
      const { error: transactionError } = await supabase
        .from('transactions')
        .update({
          status: transaction.status,
          wompi_data: transaction,
          webhook_data: eventData,
          updated_at: new Date().toISOString()
        })
        .eq('wompi_transaction_id', transaction.id);

      if (transactionError) throw transactionError;

      const paymentStatus = {
        'APPROVED': 'paid',
        'DECLINED': 'failed',
        'VOIDED': 'cancelled',
        'ERROR': 'failed'
      }[transaction.status] || 'pending';

      const orderStatus = {
        'APPROVED': 'processing',
        'DECLINED': 'cancelled',
        'VOIDED': 'cancelled'
      }[transaction.status] || 'pending';

      const { data: transactionData } = await supabase
        .from('transactions')
        .select('order_id')
        .eq('wompi_transaction_id', transaction.id)
        .single();

      if (transactionData?.order_id) {
        const { error: orderError } = await supabase
          .from('orders')
          .update({
            status: orderStatus,
            payment_status: paymentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionData.order_id);

        if (orderError) throw orderError;
      }

      console.log('Database updated successfully');
    } catch (dbError) {
      console.error('Error updating database:', dbError);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      error: 'Error processing webhook',
      message: error.message
    });
  }
});

app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'TechStore API funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'Supabase Connected',
      wompi: 'Configured'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Problemas de conectividad',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`Database: Supabase`);
  console.log(`Wompi: ${process.env.WOMPI_API_URL}`);
});

export default app;
