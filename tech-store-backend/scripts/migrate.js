import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    console.log('🔄 Iniciando migración de base de datos...');

    // Crear tabla products
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

    // Crear índices para mejor rendimiento
    await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock)`;

    // Crear función para actualizar updated_at automáticamente
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Crear trigger para updated_at
    await sql`DROP TRIGGER IF EXISTS update_products_updated_at ON products`;
    
    await sql`
      CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log('✅ Migración completada exitosamente');
    console.log('📊 Tabla products creada');
    console.log('🔍 8 índices creados para optimización');
    console.log('⚡ Trigger de auto-actualización configurado');

  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

migrate();