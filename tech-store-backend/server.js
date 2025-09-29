import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Neon Database
const sql = neon(process.env.DATABASE_URL);

// Middlewares de seguridad
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: true, // Permite todos los orígenes temporalmente
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Configurar trust proxy para Vercel
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Incrementar límite
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

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

// GET - Obtener todos los productos
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

// GET - Obtener producto por ID
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

// POST - Crear nuevo producto
app.post('/api/products', async (req, res) => {
  try {
    const {
      name, description, price, original_price, category, category_name,
      subcategory, subcategory_name, brand, model, stock, stock_quantity,
      image, images, is_active, is_featured, is_new, in_stock, discount,
      rating, reviews, total_reviews, tags, warranty, shipping,
      specifications, features, variants
    } = req.body;

    // Validaciones básicas
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

// PUT - Actualizar producto
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

// DELETE - Eliminar producto (soft delete)
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
// RUTAS DE BÚSQUEDA
// =====================

// GET - Buscar productos
app.get('/api/products/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const { category, brand, minPrice, maxPrice, limit = 50 } = req.query;

    let query = `
      SELECT * FROM products 
      WHERE is_active = true
    `;
    let params = [];
    let paramIndex = 1;

    // Búsqueda por texto
    if (term && term !== 'all') {
      query += ` AND (
        name ILIKE $${paramIndex} OR 
        description ILIKE $${paramIndex} OR 
        brand ILIKE $${paramIndex} OR
        category_name ILIKE $${paramIndex}
      )`;
      params.push(`%${term}%`);
      paramIndex++;
    }

    // Filtros adicionales
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (brand) {
      query += ` AND brand = $${paramIndex}`;
      params.push(brand);
      paramIndex++;
    }
    if (minPrice) {
      query += ` AND price >= $${paramIndex}`;
      params.push(parseFloat(minPrice));
      paramIndex++;
    }
    if (maxPrice) {
      query += ` AND price <= $${paramIndex}`;
      params.push(parseFloat(maxPrice));
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit));

    // Ejecutar query usando template literals de Neon
    const products = await sql.unsafe(query, params);

    res.json({
      success: true,
      data: products,
      count: products.length,
      searchTerm: term,
      filters: { category, brand, minPrice, maxPrice }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar productos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Productos por categoría
app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const products = await sql`
      SELECT * FROM products 
      WHERE category = ${category} AND is_active = true
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit)}
    `;

    res.json({
      success: true,
      data: products,
      count: products.length,
      category
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener productos por categoría',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// =====================
// RUTAS DE ESTADÍSTICAS
// =====================

// GET - Estadísticas del admin
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalProducts = await sql`SELECT COUNT(*) as count FROM products WHERE is_active = true`;
    const inStockProducts = await sql`SELECT COUNT(*) as count FROM products WHERE is_active = true AND in_stock = true AND stock_quantity > 0`;
    const featuredProducts = await sql`SELECT COUNT(*) as count FROM products WHERE is_active = true AND is_featured = true`;
    const newProducts = await sql`SELECT COUNT(*) as count FROM products WHERE is_active = true AND is_new = true`;
    
    const categoryStats = await sql`
      SELECT category_name, COUNT(*) as count 
      FROM products 
      WHERE is_active = true 
      GROUP BY category_name 
      ORDER BY count DESC
    `;

    const brandStats = await sql`
      SELECT brand, COUNT(*) as count 
      FROM products 
      WHERE is_active = true 
      GROUP BY brand 
      ORDER BY count DESC 
      LIMIT 10
    `;

    res.json({
      success: true,
      data: {
        total: parseInt(totalProducts[0].count),
        inStock: parseInt(inStockProducts[0].count),
        outOfStock: parseInt(totalProducts[0].count) - parseInt(inStockProducts[0].count),
        featured: parseInt(featuredProducts[0].count),
        new: parseInt(newProducts[0].count),
        byCategory: categoryStats.reduce((acc, item) => {
          acc[item.category_name] = parseInt(item.count);
          return acc;
        }, {}),
        topBrands: brandStats.map(item => ({
          brand: item.brand,
          count: parseInt(item.count)
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// =====================
// RUTA DE SALUD
// =====================
app.get('/api/health', async (req, res) => {
  try {
    // Test de conexión a la base de datos
    await sql`SELECT 1`;
    
    res.json({
      success: true,
      message: 'TechStore API funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'Connected'
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

// =====================
// ENDPOINT PARA MIGRACIONES (temporal)
// =====================
app.post('/api/migrate', async (req, res) => {
  try {
    // Crear tabla products si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        category VARCHAR(100) NOT NULL,
        category_name VARCHAR(100),
        subcategory VARCHAR(100),
        subcategory_name VARCHAR(100),
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100),
        stock INTEGER DEFAULT 0,
        stock_quantity INTEGER DEFAULT 0,
        image TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        is_new BOOLEAN DEFAULT false,
        in_stock BOOLEAN DEFAULT true,
        discount INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 4.5,
        reviews INTEGER DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        tags JSONB DEFAULT '[]'::jsonb,
        warranty VARCHAR(255) DEFAULT '12 meses de garantía',
        shipping VARCHAR(255) DEFAULT 'Envío gratis en 24-48 horas',
        specifications JSONB DEFAULT '[]'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        variants JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Crear índices
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active)`;

    res.json({
      success: true,
      message: 'Tablas creadas exitosamente'
    });
  } catch (error) {
    console.error('Error in migration:', error);
    res.status(500).json({
      success: false,
      error: 'Error en migración',
      details: error.message
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
});

export default app;
