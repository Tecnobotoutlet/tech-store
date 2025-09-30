import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Neon Database
const sql = neon(process.env.DATABASE_URL);

// IMPORTANTE: Configurar trust proxy para Vercel
app.set('trust proxy', 1);

// Middlewares de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// CORS - Lista blanca de dominios permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy no permite acceso desde este origen.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400
}));

// Rate limiting para endpoints públicos
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas peticiones desde esta IP, intenta nuevamente en 15 minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting MÁS ESTRICTO para Wompi
const wompiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 transacciones en 15 minutos
  message: 'Límite de transacciones excedido, intenta en unos minutos',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/products', publicLimiter);
app.use('/api/wompi/create-transaction', wompiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Headers para evitar caché en APIs
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
    const products = await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `;

    res.json({
      success: true,
      data: products,
      count: products.length
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
    
    const products = await sql`
      SELECT * FROM products 
      WHERE id = ${id} AND is_active = true
    `;

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: products[0]
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

    const products = await sql`
      INSERT INTO products (
        name, description, price, original_price, category, category_name,
        subcategory, subcategory_name, brand, model, stock, stock_quantity,
        image, images, is_active, is_featured, is_new, in_stock, discount,
        rating, reviews, total_reviews, tags, warranty, shipping,
        specifications, features, variants, created_at, updated_at
      ) VALUES (
        ${name}, ${description}, ${price}, ${original_price || null}, 
        ${category}, ${category_name || category}, ${subcategory || category}, 
        ${subcategory_name || category_name || category}, ${brand}, ${model || null},
        ${stock || stock_quantity || 0}, ${stock_quantity || stock || 0},
        ${image || null}, ${JSON.stringify(images || [])}, 
        ${is_active !== false}, ${is_featured || false}, ${is_new || false}, 
        ${in_stock !== false}, ${discount || 0}, ${rating || 4.5}, 
        ${reviews || 0}, ${total_reviews || 0}, ${JSON.stringify(tags || [])},
        ${warranty || '12 meses de garantía'}, ${shipping || 'Envío gratis en 24-48 horas'},
        ${JSON.stringify(specifications || [])}, ${JSON.stringify(features || [])},
        ${JSON.stringify(variants || [])}, NOW(), NOW()
      ) RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: products[0],
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
    const {
      name, description, price, original_price, category, category_name,
      subcategory, subcategory_name, brand, model, stock, stock_quantity,
      image, images, is_active, is_featured, is_new, in_stock, discount,
      rating, reviews, total_reviews, tags, warranty, shipping,
      specifications, features, variants
    } = req.body;

    const products = await sql`
      UPDATE products SET
        name = ${name},
        description = ${description},
        price = ${price},
        original_price = ${original_price || null},
        category = ${category},
        category_name = ${category_name || category},
        subcategory = ${subcategory || category},
        subcategory_name = ${subcategory_name || category_name || category},
        brand = ${brand},
        model = ${model || null},
        stock = ${stock || stock_quantity || 0},
        stock_quantity = ${stock_quantity || stock || 0},
        image = ${image || null},
        images = ${JSON.stringify(images || [])},
        is_active = ${is_active !== false},
        is_featured = ${is_featured || false},
        is_new = ${is_new || false},
        in_stock = ${in_stock !== false},
        discount = ${discount || 0},
        rating = ${rating || 4.5},
        reviews = ${reviews || 0},
        total_reviews = ${total_reviews || 0},
        tags = ${JSON.stringify(tags || [])},
        warranty = ${warranty || '12 meses de garantía'},
        shipping = ${shipping || 'Envío gratis en 24-48 horas'},
        specifications = ${JSON.stringify(specifications || [])},
        features = ${JSON.stringify(features || [])},
        variants = ${JSON.stringify(variants || [])},
        updated_at = NOW()
      WHERE id = ${id} AND is_active = true
      RETURNING *
    `;

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: products[0],
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

    const products = await sql`
      UPDATE products 
      SET is_active = false, updated_at = NOW()
      WHERE id = ${id} AND is_active = true
      RETURNING id, name
    `;

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: products[0]
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

// Obtener token de aceptación de Wompi
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

// Crear transacción en Wompi
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

    // Validaciones
    if (!orderId || !amount || !customerEmail || !paymentMethod || !acceptanceToken || !reference) {
      return res.status(400).json({ 
        success: false,
        error: 'Datos incompletos',
        message: 'Faltan campos requeridos'
      });
    }

    // Generar firma de integridad
    const amountInCents = Math.round(amount * 100);
    const integrityString = `${reference}${amountInCents}${currency}${process.env.WOMPI_INTEGRITY_SECRET}`;
    const integritySignature = crypto.createHash('sha256').update(integrityString).digest('hex');

    // Preparar datos base de la transacción
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

    // Agregar dirección de envío
    if (shippingAddress && shippingAddress.address) {
      transactionData.shipping_address = {
        address_line_1: shippingAddress.address,
        address_line_2: shippingAddress.addressDetails || '',
        city: shippingAddress.city,
        region: shippingAddress.state || shippingAddress.city,
        country: 'CO',
        phone_number: shippingAddress.phone || customerData?.phone || '',
        postal_code: shippingAddress.postalCode || ''
      };
    }

    console.log('🔐 Creating Wompi transaction:', {
      reference,
      amount: amountInCents,
      method: paymentMethod.type,
      email: customerEmail
    });

    // Crear transacción en Wompi
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
      console.error('❌ Wompi API error:', wompiData);
      throw new Error(
        wompiData.error?.reason || 
        wompiData.error?.messages?.join(', ') || 
        'Error creando transacción en Wompi'
      );
    }

    console.log('✅ Wompi transaction created:', wompiData.data.id);

    // Guardar en base de datos usando Neon
    try {
      await sql`
        INSERT INTO transactions (
          order_id,
          user_id,
          wompi_transaction_id,
          wompi_reference,
          amount,
          currency,
          status,
          payment_method_type,
          customer_email,
          customer_data,
          wompi_data,
          created_at,
          updated_at
        ) VALUES (
          ${orderId},
          ${customerData?.userId || null},
          ${wompiData.data.id},
          ${reference},
          ${amount},
          ${currency},
          ${wompiData.data.status},
          ${paymentMethod.type},
          ${customerEmail},
          ${JSON.stringify(customerData)},
          ${JSON.stringify(wompiData.data)},
          NOW(),
          NOW()
        )
      `;

      // Actualizar estado del pedido
      const orderStatus = wompiData.data.status === 'APPROVED' ? 'paid' : 'pending';
      
      await sql`
        UPDATE orders 
        SET 
          payment_status = ${orderStatus},
          updated_at = NOW()
        WHERE id = ${orderId}
      `;

      console.log('💾 Transaction saved to database');
    } catch (dbError) {
      console.error('⚠️ Error guardando en DB:', dbError);
      // No fallar la transacción si el problema es solo la DB
    }

    return res.status(200).json({
      success: true,
      transaction: wompiData.data,
      reference: reference,
      paymentUrl: wompiData.data.payment_method?.extra?.async_payment_url || null,
      status: wompiData.data.status
    });

  } catch (error) {
    console.error('❌ Error en create-transaction:', error);
    return res.status(500).json({
      success: false,
      error: 'Error procesando pago',
      message: error.message
    });
  }
});

// Consultar estado de transacción
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
      transaction: data.data
    });
  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando estado de transacción'
    });
  }
});

// Webhook de Wompi
app.post('/api/wompi/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-event-signature'];
    const eventData = req.body;

    console.log('📨 Webhook received:', {
      event: eventData.event,
      transactionId: eventData.data?.transaction?.id,
      hasSignature: !!signature
    });

    // Validar firma (OBLIGATORIO en producción)
    if (signature) {
      const bodyString = JSON.stringify(eventData);
      const expectedSignature = crypto
        .createHash('sha256')
        .update(`${bodyString}${process.env.WOMPI_EVENTS_SECRET}`)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('❌ Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('✅ Webhook signature validated');
    } else {
      console.warn('⚠️ Webhook sin firma - rechazado en producción');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const { event, data } = eventData;
    const transaction = data.transaction;

    if (!transaction) {
      return res.status(400).json({ error: 'No transaction data' });
    }

    console.log('🔄 Processing webhook:', {
      event,
      transactionId: transaction.id,
      status: transaction.status,
      reference: transaction.reference
    });

    // Actualizar transacción en DB
    try {
      await sql`
        UPDATE transactions 
        SET 
          status = ${transaction.status},
          wompi_data = ${JSON.stringify(transaction)},
          webhook_data = ${JSON.stringify(eventData)},
          updated_at = NOW()
        WHERE wompi_transaction_id = ${transaction.id}
      `;

      // Mapear estados
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

      // Actualizar pedido
      await sql`
        UPDATE orders o
        SET 
          status = ${orderStatus},
          payment_status = ${paymentStatus},
          updated_at = NOW()
        FROM transactions t
        WHERE t.order_id = o.id 
          AND t.wompi_transaction_id = ${transaction.id}
      `;

      console.log('✅ Database updated successfully');
    } catch (dbError) {
      console.error('❌ Error updating database:', dbError);
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return res.status(500).json({
      error: 'Error processing webhook',
      message: error.message
    });
  }
});

// =====================
// RUTA DE SALUD
// =====================
app.get('/api/health', async (req, res) => {
  try {
    await sql`SELECT 1`;
    
    res.json({
      success: true,
      message: 'TechStore API funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'Connected',
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

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo global de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`💾 Database: Neon PostgreSQL`);
  console.log(`💳 Wompi: ${process.env.WOMPI_API_URL}`);
});

export default app;
