// src/data/products.js - Productos actualizados con nuevo sistema de categorías
export const sampleProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    price: 5499000,
    originalPrice: 5899000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&q=80",
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 245,
    totalReviews: 245,
    discount: 7,
    category: "tecnologia",
    subcategory: "smartphones",
    categoryName: "Tecnología",
    subcategoryName: "Smartphones",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    description: "El iPhone 15 Pro Max con chip A17 Pro, cámara de 48MP con zoom óptico 5x, pantalla Super Retina XDR de 6.7 pulgadas y conectividad USB-C. Construido en titanio con la durabilidad que esperas de iPhone.",
    specifications: [
      { type: "processor", label: "Procesador", value: "Chip A17 Pro con GPU de 6 núcleos" },
      { type: "storage", label: "Almacenamiento", value: "256GB" },
      { type: "display", label: "Pantalla", value: "6.7″ Super Retina XDR OLED" },
      { type: "camera", label: "Cámara", value: "48MP Principal + 12MP Ultra Wide + 12MP Teleobjetivo" },
      { type: "battery", label: "Batería", value: "Hasta 29 horas de video" },
      { type: "os", label: "Sistema", value: "iOS 17" },
      { type: "connectivity", label: "Conectividad", value: "5G, Wi-Fi 6E, Bluetooth 5.3" },
      { type: "material", label: "Material", value: "Titanio con vidrio Ceramic Shield" }
    ],
    features: [
      "Chip A17 Pro con GPU de 6 núcleos",
      "Cámara Principal de 48MP con zoom óptico 5x",
      "Pantalla Super Retina XDR Always-On",
      "Diseño de titanio resistente",
      "USB-C para carga rápida",
      "Ceramic Shield más resistente que el vidrio de smartphone",
      "Resistente al agua IP68",
      "Face ID avanzado"
    ],
    tags: ["premium", "flagship", "5g", "titanium", "photography"],
    inStock: true,
    stockQuantity: 15,
    isNew: true,
    isFeatured: true,
    warranty: "12 meses de garantía Apple",
    shipping: "Envío gratis en 24-48 horas",
    variants: [
      { name: "Natural Titanium", color: "#E8E8E8", available: true },
      { name: "Blue Titanium", color: "#4A90E2", available: true },
      { name: "White Titanium", color: "#F5F5F5", available: false },
      { name: "Black Titanium", color: "#2C2C2C", available: true }
    ]
  },
  {
    id: 2,
    name: "MacBook Air M2 13\" 8GB/256GB",
    price: 4799000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80"
    ],
    rating: 4.9,
    reviews: 189,
    totalReviews: 189,
    discount: 0,
    category: "tecnologia",
    subcategory: "laptops",
    categoryName: "Tecnología",
    subcategoryName: "Laptops",
    brand: "Apple",
    model: "MacBook Air M2",
    description: "El MacBook Air con chip M2 redefinido. Increíblemente delgado, con una pantalla Liquid Retina de 13.6 pulgadas, cámara FaceTime HD de 1080p y hasta 18 horas de batería.",
    specifications: [
      { type: "processor", label: "Procesador", value: "Chip Apple M2 de 8 núcleos" },
      { type: "ram", label: "Memoria", value: "8GB RAM unificada" },
      { type: "storage", label: "Almacenamiento", value: "SSD de 256GB" },
      { type: "display", label: "Pantalla", value: "13.6″ Liquid Retina (2560x1664)" },
      { type: "graphics", label: "GPU", value: "GPU de 8 núcleos" },
      { type: "battery", label: "Batería", value: "Hasta 18 horas" },
      { type: "ports", label: "Puertos", value: "2x Thunderbolt, MagSafe 3, 3.5mm" },
      { type: "weight", label: "Peso", value: "1.24 kg" }
    ],
    features: [
      "Chip M2 de Apple con CPU de 8 núcleos",
      "GPU de hasta 8 núcleos",
      "Pantalla Liquid Retina de 13.6 pulgadas",
      "Hasta 18 horas de batería",
      "Carga MagSafe",
      "Cámara FaceTime HD 1080p",
      "Cuatro altavoces con sonido espacial",
      "macOS Ventura incluido"
    ],
    tags: ["apple", "ultrabook", "productivity", "lightweight"],
    inStock: true,
    stockQuantity: 8,
    isNew: false,
    isFeatured: true,
    warranty: "12 meses de garantía Apple + AppleCare disponible",
    shipping: "Envío gratis en 24-48 horas",
    variants: [
      { name: "Plata", color: "#E8E8E8", available: true },
      { name: "Gris espacial", color: "#5D5D5D", available: true },
      { name: "Dorado", color: "#FDBCB4", available: true },
      { name: "Azul medianoche", color: "#1B1B3C", available: false }
    ]
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra 512GB",
    price: 4299000,
    originalPrice: 4699000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
      "https://images.unsplash.com/photo-1512499617640-c46f3eb5ada9?w=800&q=80",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80"
    ],
    rating: 4.7,
    reviews: 324,
    totalReviews: 324,
    discount: 9,
    category: "tecnologia",
    subcategory: "smartphones",
    categoryName: "Tecnología",
    subcategoryName: "Smartphones",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    description: "El Samsung Galaxy S24 Ultra con S Pen integrado, cámara de 200MP con zoom espacial 100x, pantalla Dynamic AMOLED 2X de 6.8 pulgadas y procesador Snapdragon 8 Gen 3.",
    specifications: [
      { type: "processor", label: "Procesador", value: "Snapdragon 8 Gen 3 para Galaxy" },
      { type: "ram", label: "Memoria", value: "12GB RAM" },
      { type: "storage", label: "Almacenamiento", value: "512GB UFS 4.0" },
      { type: "display", label: "Pantalla", value: "6.8″ Dynamic AMOLED 2X (3120x1440)" },
      { type: "camera", label: "Cámara", value: "200MP + 50MP + 12MP + 10MP" },
      { type: "battery", label: "Batería", value: "5000mAh con carga rápida 45W" },
      { type: "os", label: "Sistema", value: "Android 14 con One UI 6.1" },
      { type: "spen", label: "S Pen", value: "S Pen integrado con IA" }
    ],
    features: [
      "S Pen integrado con funciones de IA",
      "Cámara principal de 200MP",
      "Zoom espacial hasta 100x",
      "Pantalla Dynamic AMOLED 2X de 120Hz",
      "Procesador Snapdragon 8 Gen 3 para Galaxy",
      "Batería de 5000mAh",
      "Resistente al agua IP68",
      "Samsung DeX para productividad"
    ],
    tags: ["android", "spen", "photography", "flagship", "productivity"],
    inStock: true,
    stockQuantity: 12,
    isNew: false,
    isFeatured: false,
    warranty: "24 meses de garantía Samsung",
    shipping: "Envío gratis en 24-48 horas",
    variants: [
      { name: "Titanium Black", color: "#2C2C2C", available: true },
      { name: "Titanium Gray", color: "#8E8E8E", available: true },
      { name: "Titanium Violet", color: "#8B7BB8", available: false },
      { name: "Titanium Yellow", color: "#F4D03F", available: true }
    ]
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Auriculares",
    price: 1299000,
    originalPrice: 1499000,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 156,
    totalReviews: 156,
    discount: 13,
    category: "tecnologia",
    subcategory: "audio",
    categoryName: "Tecnología",
    subcategoryName: "Audio",
    brand: "Sony",
    model: "WH-1000XM5",
    description: "Los auriculares inalámbricos Sony WH-1000XM5 con la mejor cancelación de ruido de la industria, sonido premium y hasta 30 horas de batería. Diseño liviano y cómodo para uso prolongado.",
    specifications: [
      { type: "driver", label: "Drivers", value: "30mm tipo domo" },
      { type: "frequency", label: "Respuesta de frecuencia", value: "4Hz - 40,000Hz" },
      { type: "battery", label: "Batería", value: "30 horas (ANC activado)" },
      { type: "connectivity", label: "Conectividad", value: "Bluetooth 5.2, LDAC, aptX" },
      { type: "anc", label: "Cancelación de ruido", value: "Dual Noise Sensor" },
      { type: "weight", label: "Peso", value: "250g" },
      { type: "charging", label: "Carga", value: "USB-C, carga rápida 3min = 3h" },
      { type: "controls", label: "Controles", value: "Táctiles + botón físico" }
    ],
    features: [
      "Cancelación de ruido líder en la industria",
      "Hasta 30 horas de batería",
      "Sonido Hi-Res con LDAC",
      "Carga rápida: 3 minutos = 3 horas",
      "Controles táctiles intuitivos",
      "Speak-to-Chat automático",
      "Multipoint para 2 dispositivos",
      "App Sony Headphones Connect"
    ],
    tags: ["wireless", "anc", "premium", "comfort"],
    inStock: true,
    stockQuantity: 25,
    isNew: false,
    isFeatured: false,
    warranty: "12 meses de garantía Sony",
    shipping: "Envío gratis en 24-48 horas",
    variants: [
      { name: "Negro", color: "#000000", available: true },
      { name: "Plata", color: "#C0C0C0", available: true }
    ]
  },
  {
    id: 5,
    name: "ASUS ROG Strix G15 RTX 4060",
    price: 3899000,
    originalPrice: 4299000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80"
    ],
    rating: 4.5,
    reviews: 98,
    totalReviews: 98,
    discount: 9,
    category: "tecnologia",
    subcategory: "gaming",
    categoryName: "Tecnología",
    subcategoryName: "Gaming",
    brand: "ASUS",
    model: "ROG Strix G15",
    description: "Laptop gaming ASUS ROG Strix G15 con procesador AMD Ryzen 7, gráfica RTX 4060, pantalla de 144Hz y sistema de refrigeración avanzado para el máximo rendimiento en juegos.",
    specifications: [
      { type: "processor", label: "Procesador", value: "AMD Ryzen 7 7735HS (8 núcleos)" },
      { type: "graphics", label: "GPU", value: "NVIDIA RTX 4060 8GB GDDR6" },
      { type: "ram", label: "Memoria", value: "16GB DDR5-4800" },
      { type: "storage", label: "Almacenamiento", value: "512GB NVMe SSD" },
      { type: "display", label: "Pantalla", value: "15.6″ FHD 144Hz IPS" },
      { type: "keyboard", label: "Teclado", value: "RGB per-key con switches mecánicos" },
      { type: "cooling", label: "Refrigeración", value: "ROG Intelligent Cooling" },
      { type: "ports", label: "Puertos", value: "USB-C, USB 3.2, HDMI 2.1, RJ45" }
    ],
    features: [
      "Procesador AMD Ryzen 7 de 8 núcleos",
      "NVIDIA RTX 4060 con 8GB VRAM",
      "Pantalla de 144Hz para gaming fluido",
      "Teclado RGB mecánico",
      "Sistema de refrigeración ROG",
      "Audio certificado por Dolby Atmos",
      "Wi-Fi 6E para conexión estable",
      "Armoury Crate para optimización"
    ],
    tags: ["gaming", "high-performance", "rgb", "144hz"],
    inStock: true,
    stockQuantity: 5,
    isNew: true,
    isFeatured: true,
    warranty: "24 meses de garantía ASUS + 1 año adicional disponible",
    shipping: "Envío gratis en 48-72 horas",
    variants: [
      { name: "Eclipse Gray", color: "#4A4A4A", available: true },
      { name: "Electro Punk", color: "#FF6B9D", available: false }
    ]
  },
  
  // Productos de otras categorías
  {
    id: 6,
    name: "Camiseta Nike Dri-FIT Running",
    price: 89000,
    originalPrice: 109000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
    ],
    rating: 4.4,
    reviews: 87,
    totalReviews: 87,
    discount: 18,
    category: "deportes",
    subcategory: "fitness",
    categoryName: "Deportes y Fitness",
    subcategoryName: "Fitness",
    brand: "Nike",
    model: "Dri-FIT",
    description: "Camiseta Nike Dri-FIT para running con tecnología de absorción del sudor, diseño ergonómico y máxima comodidad para entrenamientos intensos.",
    specifications: [
      { type: "material", label: "Material", value: "100% Poliéster reciclado" },
      { type: "technology", label: "Tecnología", value: "Dri-FIT" },
      { type: "fit", label: "Ajuste", value: "Regular" },
      { type: "care", label: "Cuidado", value: "Lavable a máquina" }
    ],
    features: [
      "Tecnología Dri-FIT para absorción del sudor",
      "Material 100% reciclado",
      "Costuras planas para mayor comodidad",
      "Diseño ergonómico",
      "Secado rápido"
    ],
    tags: ["running", "fitness", "sweat-wicking", "eco-friendly"],
    inStock: true,
    stockQuantity: 50,
    isNew: false,
    isFeatured: false,
    warranty: "6 meses de garantía Nike",
    shipping: "Envío gratis en 24-48 horas",
    variants: [
      { name: "Negro", color: "#000000", available: true },
      { name: "Azul", color: "#0066CC", available: true },
      { name: "Rojo", color: "#CC0000", available: true }
    ]
  },
  {
    id: 7,
    name: "Sofá 3 Puestos Moderno",
    price: 1599000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
    ],
    rating: 4.6,
    reviews: 23,
    totalReviews: 23,
    discount: 0,
    category: "hogar",
    subcategory: "muebles",
    categoryName: "Hogar y Jardín",
    subcategoryName: "Muebles",
    brand: "IKEA",
    model: "Modern",
    description: "Sofá moderno de 3 puestos con tapizado en tela de alta calidad, estructura de madera maciza y cojines de espuma de alta densidad para máximo confort.",
    specifications: [
      { type: "material", label: "Material", value: "Estructura: Madera maciza, Tapizado: Tela" },
      { type: "dimensions", label: "Dimensiones", value: "210 x 90 x 85 cm" },
      { type: "capacity", label: "Capacidad", value: "3 personas" },
      { type: "weight", label: "Peso", value: "65 kg" }
    ],
    features: [
      "Estructura de madera maciza",
      "Tapizado en tela de alta calidad",
      "Cojines de espuma de alta densidad",
      "Diseño moderno y elegante",
      "Fácil montaje"
    ],
    tags: ["furniture", "living-room", "comfort", "modern"],
    inStock: true,
    stockQuantity: 3,
    isNew: false,
    isFeatured: true,
    warranty: "24 meses de garantía",
    shipping: "Envío e instalación gratis",
    variants: [
      { name: "Gris", color: "#808080", available: true },
      { name: "Beige", color: "#F5F5DC", available: false },
      { name: "Azul marino", color: "#000080", available: true }
    ]
  },
  {
    id: 8,
    name: "Vitamina D3 1000 UI",
    price: 45000,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=800&q=80"
    ],
    rating: 4.8,
    reviews: 156,
    totalReviews: 156,
    discount: 0,
    category: "salud",
    subcategory: "vitaminas",
    categoryName: "Salud y Belleza",
    subcategoryName: "Vitaminas y Suplementos",
    brand: "Centrum",
    model: "D3 1000",
    description: "Suplemento de Vitamina D3 1000 UI para mantener huesos y dientes fuertes, apoyar el sistema inmunológico y promover la absorción de calcio.",
    specifications: [
      { type: "dosage", label: "Dosis", value: "1000 UI por tableta" },
      { type: "quantity", label: "Cantidad", value: "60 tabletas" },
      { type: "duration", label: "Duración", value: "2 meses" },
      { type: "form", label: "Forma", value: "Tabletas" }
    ],
    features: [
      "1000 UI de Vitamina D3 por tableta",
      "Apoya la salud ósea",
      "Fortalece el sistema inmunológico",
      "Fácil absorción",
      "Sin gluten"
    ],
    tags: ["vitamin-d", "bone-health", "immune-support", "supplement"],
    inStock: true,
    stockQuantity: 100,
    isNew: false,
    isFeatured: false,
    warranty: "Garantía de frescura",
    shipping: "Envío gratis en 24-48 horas",
    variants: [
      { name: "60 tabletas", color: "#FFFFFF", available: true },
      { name: "120 tabletas", color: "#FFFFFF", available: true }
    ]
  }
];

// Reseñas de productos actualizadas
export const productReviews = {
  1: [
    {
      id: 1,
      user: "Carlos M.",
      rating: 5,
      date: "2025-01-15",
      title: "Excelente teléfono",
      comment: "La calidad de la cámara es impresionante, especialmente en condiciones de poca luz. La batería dura todo el día sin problemas.",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      user: "Ana L.",
      rating: 4,
      date: "2025-01-10",
      title: "Muy bueno pero caro",
      comment: "Es un excelente dispositivo con rendimiento excepcional. El único punto negativo es el precio.",
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      user: "Miguel R.",
      rating: 5,
      date: "2025-01-05",
      title: "El mejor iPhone hasta ahora",
      comment: "Upgrade desde el iPhone 13 Pro y la diferencia es notable. El chip A17 Pro es una bestia.",
      helpful: 15,
      verified: true
    }
  ],
  2: [
    {
      id: 4,
      user: "Laura S.",
      rating: 5,
      date: "2024-12-28",
      title: "Perfecta para desarrollo",
      comment: "Como desarrolladora, esta MacBook Air M2 maneja múltiples aplicaciones sin problemas. La batería es increíble.",
      helpful: 20,
      verified: true
    },
    {
      id: 5,
      user: "Roberto P.",
      rating: 4,
      date: "2024-12-20",
      title: "Ligera y potente",
      comment: "Excelente para trabajo y entretenimiento. Solo le falta más puertos.",
      helpful: 6,
      verified: true
    }
  ],
  6: [
    {
      id: 6,
      user: "Sandra K.",
      rating: 5,
      date: "2025-01-12",
      title: "Perfecta para correr",
      comment: "Muy cómoda, no se siente húmeda después de entrenamientos largos. La tela es de excelente calidad.",
      helpful: 5,
      verified: true
    }
  ],
  7: [
    {
      id: 7,
      user: "Pedro J.",
      rating: 4,
      date: "2025-01-08",
      title: "Muy cómodo",
      comment: "El sofá es tal como se ve en las fotos. Muy cómodo y de buena calidad. La entrega fue puntual.",
      helpful: 3,
      verified: true
    }
  ]
};

// Funciones auxiliares actualizadas
export const getProductsByCategory = (categoryId, subcategoryId = null) => {
  return sampleProducts.filter(product => {
    if (subcategoryId) {
      return product.category === categoryId && product.subcategory === subcategoryId;
    }
    return product.category === categoryId;
  });
};

export const getProductsByBrand = (brand) => {
  return sampleProducts.filter(product => 
    product.brand.toLowerCase() === brand.toLowerCase()
  );
};

export const getProductsByTag = (tag) => {
  return sampleProducts.filter(product => 
    product.tags && product.tags.includes(tag)
  );
};

export const getFeaturedProducts = () => {
  return sampleProducts.filter(product => product.isFeatured);
};

export const getNewProducts = () => {
  return sampleProducts.filter(product => product.isNew);
};

export const getDiscountedProducts = () => {
  return sampleProducts.filter(product => product.discount > 0);
};

export const searchProducts = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return sampleProducts.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.brand.toLowerCase().includes(term) ||
    product.categoryName.toLowerCase().includes(term) ||
    product.subcategoryName.toLowerCase().includes(term) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term)))
  );
};

export const getProductById = (id) => {
  return sampleProducts.find(product => product.id === parseInt(id));
};

// Estadísticas de productos
export const getProductStats = () => {
  const totalProducts = sampleProducts.length;
  const inStockProducts = sampleProducts.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const featuredProducts = sampleProducts.filter(p => p.isFeatured).length;
  const discountedProducts = sampleProducts.filter(p => p.discount > 0).length;
  
  const categoryStats = {};
  sampleProducts.forEach(product => {
    if (!categoryStats[product.categoryName]) {
      categoryStats[product.categoryName] = 0;
    }
    categoryStats[product.categoryName]++;
  });
  
  return {
    total: totalProducts,
    inStock: inStockProducts,
    outOfStock: outOfStockProducts,
    featured: featuredProducts,
    discounted: discountedProducts,
    byCategory: categoryStats
  };
};

// Exportar categorías actualizadas para compatibilidad
export const categories = [
  { name: 'Tecnología', count: 5 },
  { name: 'Deportes y Fitness', count: 1 },
  { name: 'Hogar y Jardín', count: 1 },
  { name: 'Salud y Belleza', count: 1 },
  { name: 'Moda y Ropa', count: 0 },
  { name: 'Libros y Media', count: 0 }
];
