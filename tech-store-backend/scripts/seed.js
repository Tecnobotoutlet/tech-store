import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const sampleProducts = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'El iPhone más avanzado con chip A17 Pro, cámaras profesionales y diseño de titanio.',
    price: 1299.99,
    original_price: 1399.99,
    category: 'tecnologia',
    category_name: 'Tecnología',
    brand: 'Apple',
    model: 'A3108',
    stock_quantity: 50,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&q=80'
    ],
    is_featured: true,
    is_new: true,
    discount: 7,
    rating: 4.8,
    reviews: 1250,
    tags: ['smartphone', 'premium', 'apple', '5g', 'titanio'],
    specifications: [
      { type: 'processor', label: 'Procesador', value: 'A17 Pro Bionic' },
      { type: 'storage', label: 'Almacenamiento', value: '256GB' },
      { type: 'display', label: 'Pantalla', value: '6.7" Super Retina XDR' },
      { type: 'camera', label: 'Cámara', value: '48MP + 12MP + 12MP' },
      { type: 'battery', label: 'Batería', value: 'Hasta 29 horas de video' }
    ],
    features: [
      'Chip A17 Pro con GPU de 6 núcleos',
      'Sistema de cámaras Pro con zoom óptico 5x',
      'Pantalla Super Retina XDR de 6.7 pulgadas',
      'Diseño de titanio resistente y ligero',
      'Botón de Acción personalizable',
      'Conector USB-C'
    ]
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone premium con S Pen integrado, cámaras con IA y pantalla AMOLED 2X de 6.8 pulgadas.',
    price: 1199.99,
    category: 'tecnologia',
    category_name: 'Tecnología',
    brand: 'Samsung',
    model: 'SM-S928B',
    stock_quantity: 30,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80'
    ],
    is_featured: true,
    rating: 4.7,
    reviews: 890,
    tags: ['smartphone', 'android', 'samsung', 's-pen', 'ia'],
    specifications: [
      { type: 'processor', label: 'Procesador', value: 'Snapdragon 8 Gen 3' },
      { type: 'storage', label: 'Almacenamiento', value: '256GB' },
      { type: 'display', label: 'Pantalla', value: '6.8" Dynamic AMOLED 2X' },
      { type: 'camera', label: 'Cámara', value: '200MP + 50MP + 12MP + 10MP' }
    ],
    features: [
      'S Pen integrado con funciones IA',
      'Cámara principal de 200MP',
      'Zoom óptico 5x y digital 100x',
      'Galaxy AI integrada',
      'Pantalla de 6.8 pulgadas'
    ]
  },
  {
    name: 'MacBook Air M3',
    description: 'Laptop ultradelgada con chip M3, hasta 18 horas de batería y pantalla Liquid Retina de 13 pulgadas.',
    price: 1099.99,
    category: 'tecnologia',
    category_name: 'Tecnología',
    brand: 'Apple',
    model: 'MBA13-M3',
    stock_quantity: 25,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80'
    ],
    is_new: true,
    rating: 4.9,
    reviews: 540,
    tags: ['laptop', 'apple', 'ultrabook', 'm3', 'portable'],
    specifications: [
      { type: 'processor', label: 'Procesador', value: 'Apple M3' },
      { type: 'ram', label: 'Memoria RAM', value: '8GB unificada' },
      { type: 'storage', label: 'Almacenamiento', value: '256GB SSD' },
      { type: 'display', label: 'Pantalla', value: '13.6" Liquid Retina' }
    ],
    features: [
      'Chip Apple M3 de nueva generación',
      'Hasta 18 horas de batería',
      'Diseño ultradelgado de 1.13 cm',
      'Pantalla Liquid Retina de 13.6 pulgadas',
      'MagSafe 3 y puertos Thunderbolt'
    ]
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria y calidad de sonido superior.',
    price: 399.99,
    original_price: 449.99,
    category: 'tecnologia',
    category_name: 'Tecnología',
    brand: 'Sony',
    model: 'WH1000XM5',
    stock_quantity: 75,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&q=80'
    ],
    is_featured: true,
    discount: 11,
    rating: 4.6,
    reviews: 2340,
    tags: ['audífonos', 'inalámbricos', 'noise-cancelling', 'premium'],
    specifications: [
      { type: 'connectivity', label: 'Conectividad', value: 'Bluetooth 5.2, NFC' },
      { type: 'battery', label: 'Batería', value: '30 horas con ANC' },
      { type: 'weight', label: 'Peso', value: '250 gramos' },
      { type: 'other', label: 'Cancelación de ruido', value: 'Activa con IA' }
    ],
    features: [
      'Cancelación de ruido líder en la industria',
      '30 horas de batería con ANC activado',
      'Carga rápida: 3 min = 3 horas de uso',
      'Procesador V1 y controladores de 30mm',
      'Llamadas cristalinas con 4 micrófonos'
    ]
  },
  {
    name: 'iPad Pro 12.9" M4',
    description: 'La tablet más avanzada con chip M4, pantalla Liquid Retina XDR y compatible con Apple Pencil Pro.',
    price: 1299.99,
    category: 'tecnologia',
    category_name: 'Tecnología',
    brand: 'Apple',
    model: 'iPad Pro M4',
    stock_quantity: 40,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80'
    ],
    is_new: true,
    is_featured: true,
    rating: 4.8,
    reviews: 780,
    tags: ['tablet', 'profesional', 'm4', 'creative'],
    specifications: [
      { type: 'processor', label: 'Procesador', value: 'Apple M4' },
      { type: 'display', label: 'Pantalla', value: '12.9" Liquid Retina XDR' },
      { type: 'storage', label: 'Almacenamiento', value: '256GB' },
      { type: 'camera', label: 'Cámara', value: '12MP + LiDAR' }
    ],
    features: [
      'Chip M4 con Neural Engine de 16 núcleos',
      'Pantalla Liquid Retina XDR de 12.9"',
      'Compatible con Apple Pencil Pro',
      'Magic Keyboard con trackpad',
      'Thunderbolt/USB 4'
    ]
  }
];

async function seed() {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Verificar si ya hay productos
    const existingProducts = await sql`SELECT COUNT(*) as count FROM products`;
    
    if (parseInt(existingProducts[0].count) > 0) {
      console.log('⚠️  Ya hay productos en la base de datos. Saltando seed...');
      console.log(`📊 Productos existentes: ${existingProducts[0].count}`);
      return;
    }

    // Insertar productos de ejemplo
    let insertedCount = 0;
    for (const product of sampleProducts) {
      await sql`
        INSERT INTO products (
          name, description, price, original_price, category, category_name,
          brand, model, stock_quantity, stock, image, images, is_featured, 
          is_new, discount, rating, reviews, tags, specifications, features,
          in_stock, warranty, shipping, created_at, updated_at
        ) VALUES (
          ${product.name}, 
          ${product.description}, 
          ${product.price}, 
          ${product.original_price || null}, 
          ${product.category}, 
          ${product.category_name},
          ${product.brand}, 
          ${product.model || null}, 
          ${product.stock_quantity}, 
          ${product.stock_quantity}, 
          ${product.image}, 
          ${JSON.stringify(product.images || [])},
          ${product.is_featured || false}, 
          ${product.is_new || false}, 
          ${product.discount || 0}, 
          ${product.rating || 4.5}, 
          ${product.reviews || 0},
          ${JSON.stringify(product.tags || [])}, 
          ${JSON.stringify(product.specifications || [])},
          ${JSON.stringify(product.features || [])},
          ${product.stock_quantity > 0},
          ${product.warranty || '12 meses de garantía'},
          ${product.shipping || 'Envío gratis en 24-48 horas'},
          NOW(), 
          NOW()
        )
      `;
      insertedCount++;
      console.log(`✓ Insertado: ${product.name}`);
    }

    console.log(`✅ Seed completado: ${insertedCount} productos insertados`);
    
    // Mostrar estadísticas
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_featured THEN 1 ELSE 0 END) as featured,
        SUM(CASE WHEN is_new THEN 1 ELSE 0 END) as new_products,
        COUNT(DISTINCT brand) as brands,
        COUNT(DISTINCT category) as categories,
        SUM(stock_quantity) as total_stock
      FROM products WHERE is_active = true
    `;
    
    console.log('\n📊 Estadísticas finales:');
    console.log(`   - Total productos: ${stats[0].total}`);
    console.log(`   - Productos destacados: ${stats[0].featured}`);
    console.log(`   - Productos nuevos: ${stats[0].new_products}`);
    console.log(`   - Marcas únicas: ${stats[0].brands}`);
    console.log(`   - Categorías únicas: ${stats[0].categories}`);
    console.log(`   - Stock total: ${stats[0].total_stock} unidades`);

    // Verificar que los datos se insertaron correctamente
    const sampleProduct = await sql`SELECT name, price, brand FROM products LIMIT 1`;
    console.log(`\n🔍 Producto de prueba: ${sampleProduct[0].name} - $${sampleProduct[0].price} - ${sampleProduct[0].brand}`);

  } catch (error) {
    console.error('❌ Error en seed:', error);
    console.error('Detalles:', error.message);
    process.exit(1);
  }
}

seed();