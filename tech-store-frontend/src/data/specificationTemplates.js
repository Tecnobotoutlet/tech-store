// src/data/specificationTemplates.js

// Plantillas de especificaciones por categoría
export const SPECIFICATION_TEMPLATES = {
  tecnologia: {
    name: 'Tecnología',
    types: [
      { type: 'processor', label: 'Procesador', placeholder: 'Intel i7, Apple M3, Snapdragon 8 Gen 3' },
      { type: 'ram', label: 'Memoria RAM', placeholder: '8GB, 16GB, 32GB' },
      { type: 'storage', label: 'Almacenamiento', placeholder: '256GB SSD, 512GB SSD, 1TB' },
      { type: 'display', label: 'Pantalla', placeholder: '15.6" Full HD, 6.1" OLED' },
      { type: 'graphics', label: 'Gráficos', placeholder: 'NVIDIA RTX 4060, Intel Iris Xe' },
      { type: 'battery', label: 'Batería', placeholder: '5000mAh, hasta 10 horas' },
      { type: 'camera', label: 'Cámara', placeholder: '48MP + 12MP + 12MP' },
      { type: 'os', label: 'Sistema Operativo', placeholder: 'Windows 11, Android 14, iOS 17' },
      { type: 'connectivity', label: 'Conectividad', placeholder: '5G, Wi-Fi 6E, Bluetooth 5.3' },
      { type: 'ports', label: 'Puertos', placeholder: '2x USB-C, 1x HDMI, jack 3.5mm' },
      { type: 'weight', label: 'Peso', placeholder: '1.2kg, 180g' },
      { type: 'dimensions', label: 'Dimensiones', placeholder: '30cm x 20cm x 1.5cm' }
    ],
    variantTypes: [
      { type: 'color', label: 'Color' },
      { type: 'storage', label: 'Almacenamiento', options: ['128GB', '256GB', '512GB', '1TB'] },
      { type: 'ram', label: 'Memoria RAM', options: ['8GB', '16GB', '32GB', '64GB'] }
    ]
  },

  moda: {
    name: 'Moda y Ropa',
    types: [
      { type: 'size', label: 'Tallas Disponibles', placeholder: 'XS, S, M, L, XL, XXL' },
      { type: 'material', label: 'Material', placeholder: '100% Algodón, Poliéster, Mezcla' },
      { type: 'cut', label: 'Corte', placeholder: 'Slim Fit, Regular, Oversize' },
      { type: 'care', label: 'Cuidado', placeholder: 'Lavar a máquina 30°C' },
      { type: 'weight', label: 'Peso', placeholder: '200g, 350g' },
      { type: 'season', label: 'Temporada', placeholder: 'Primavera/Verano, Otoño/Invierno' },
      { type: 'style', label: 'Estilo', placeholder: 'Casual, Formal, Deportivo' }
    ],
    variantTypes: [
      { type: 'size', label: 'Talla', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
      { type: 'color', label: 'Color' }
    ]
  },

  calzado: {
    name: 'Calzado',
    types: [
      { type: 'size', label: 'Tallas Disponibles', placeholder: '34 a 45' },
      { type: 'material', label: 'Material', placeholder: 'Cuero genuino, Sintético, Textil' },
      { type: 'sole', label: 'Tipo de Suela', placeholder: 'Goma, EVA, Caucho' },
      { type: 'closure', label: 'Cierre', placeholder: 'Cordones, Velcro, Sin cordones' },
      { type: 'weight', label: 'Peso', placeholder: '300g por zapato' },
      { type: 'heel', label: 'Altura Tacón', placeholder: '2cm, 5cm, 8cm' },
      { type: 'width', label: 'Ancho', placeholder: 'Regular, Ancho, Extra Ancho' }
    ],
    variantTypes: [
      { 
        type: 'size', 
        label: 'Talla', 
        options: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'] 
      },
      { type: 'color', label: 'Color' }
    ]
  },

  hogar: {
    name: 'Hogar y Jardín',
    types: [
      { type: 'dimensions', label: 'Dimensiones', placeholder: '120cm x 80cm x 75cm' },
      { type: 'material', label: 'Material', placeholder: 'Madera, Metal, Plástico' },
      { type: 'weight', label: 'Peso', placeholder: '15kg, 25kg' },
      { type: 'capacity', label: 'Capacidad', placeholder: 'Soporta hasta 100kg' },
      { type: 'assembly', label: 'Armado', placeholder: 'Requiere armado, Pre-armado' },
      { type: 'color', label: 'Colores Disponibles', placeholder: 'Blanco, Negro, Madera' },
      { type: 'warranty', label: 'Garantía', placeholder: '2 años' }
    ],
    variantTypes: [
      { type: 'color', label: 'Color' },
      { type: 'size', label: 'Tamaño', options: ['Pequeño', 'Mediano', 'Grande'] }
    ]
  },

  deportes: {
    name: 'Deportes y Fitness',
    types: [
      { type: 'size', label: 'Talla', placeholder: 'S, M, L, XL o Única' },
      { type: 'material', label: 'Material', placeholder: 'Neopreno, Acero, Aluminio' },
      { type: 'weight', label: 'Peso', placeholder: '5kg, 10kg, 20kg' },
      { type: 'resistance', label: 'Resistencia', placeholder: 'Ligera, Media, Fuerte' },
      { type: 'capacity', label: 'Capacidad', placeholder: 'Soporta hasta 150kg' },
      { type: 'adjustable', label: 'Ajustable', placeholder: 'Sí, múltiples niveles' }
    ],
    variantTypes: [
      { type: 'size', label: 'Talla', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { type: 'weight', label: 'Peso', options: ['5kg', '10kg', '15kg', '20kg'] },
      { type: 'color', label: 'Color' }
    ]
  },

  salud: {
    name: 'Salud y Belleza',
    types: [
      { type: 'volume', label: 'Volumen/Cantidad', placeholder: '50ml, 100ml, 250ml' },
      { type: 'type', label: 'Tipo', placeholder: 'Gel, Crema, Loción, Sérum' },
      { type: 'skinType', label: 'Tipo de Piel', placeholder: 'Todo tipo, Grasa, Seca, Mixta' },
      { type: 'ingredients', label: 'Ingredientes Clave', placeholder: 'Ácido Hialurónico, Vitamina C' },
      { type: 'spf', label: 'Factor SPF', placeholder: 'SPF 30, SPF 50' },
      { type: 'scent', label: 'Fragancia', placeholder: 'Sin fragancia, Floral, Cítrico' }
    ],
    variantTypes: [
      { type: 'size', label: 'Tamaño', options: ['50ml', '100ml', '200ml', '250ml'] },
      { type: 'scent', label: 'Fragancia' }
    ]
  }
};

// Obtener template por categoría
export const getSpecificationTemplate = (categorySlug) => {
  return SPECIFICATION_TEMPLATES[categorySlug] || SPECIFICATION_TEMPLATES.tecnologia;
};

// Obtener tipos de variantes por categoría
export const getVariantTypes = (categorySlug) => {
  const template = SPECIFICATION_TEMPLATES[categorySlug];
  return template?.variantTypes || [{ type: 'color', label: 'Color' }];
};

// Validar si una especificación es requerida para la categoría
export const isRequiredSpec = (categorySlug, specType) => {
  const requiredSpecs = {
    tecnologia: ['processor', 'ram', 'storage'],
    moda: ['size', 'material'],
    calzado: ['size', 'material'],
    hogar: ['dimensions', 'material'],
    deportes: ['material'],
    salud: ['volume', 'type']
  };
  
  return requiredSpecs[categorySlug]?.includes(specType) || false;
};