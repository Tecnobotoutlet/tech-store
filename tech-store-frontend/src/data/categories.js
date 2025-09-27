// src/data/categories.js - Sistema de Categorías Escalable
export const categories = {
  tecnologia: {
    id: 'tecnologia',
    name: 'Tecnología',
    icon: '📱',
    description: 'Productos tecnológicos y electrónicos',
    subcategories: {
      smartphones: {
        id: 'smartphones',
        name: 'Smartphones',
        description: 'Teléfonos inteligentes de todas las marcas',
        brands: ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus', 'Google'],
        filters: ['Marca', 'Pantalla', 'Almacenamiento', 'RAM', 'Cámara', 'Batería']
      },
      laptops: {
        id: 'laptops',
        name: 'Laptops',
        description: 'Computadoras portátiles para trabajo y gaming',
        brands: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI'],
        filters: ['Marca', 'Procesador', 'RAM', 'Almacenamiento', 'Pantalla', 'Gráficos']
      },
      tablets: {
        id: 'tablets',
        name: 'Tablets',
        description: 'Tabletas para productividad y entretenimiento',
        brands: ['Apple', 'Samsung', 'Lenovo', 'Huawei', 'Microsoft'],
        filters: ['Marca', 'Pantalla', 'Almacenamiento', 'Sistema operativo']
      },
      gaming: {
        id: 'gaming',
        name: 'Gaming',
        description: 'Consolas, juegos y accesorios gaming',
        brands: ['PlayStation', 'Xbox', 'Nintendo', 'Steam', 'Logitech', 'Razer'],
        filters: ['Plataforma', 'Género', 'Clasificación', 'Multijugador']
      },
      audio: {
        id: 'audio',
        name: 'Audio',
        description: 'Audífonos, parlantes y equipos de sonido',
        brands: ['Sony', 'Bose', 'JBL', 'Sennheiser', 'Audio-Technica', 'Beats'],
        filters: ['Tipo', 'Conectividad', 'Cancelación de ruido', 'Uso']
      },
      accesorios: {
        id: 'accesorios',
        name: 'Accesorios',
        description: 'Cargadores, cables, fundas y más',
        brands: ['Apple', 'Samsung', 'Anker', 'Belkin', 'Generic'],
        filters: ['Compatibilidad', 'Tipo', 'Material']
      }
    }
  },
  
  hogar: {
    id: 'hogar',
    name: 'Hogar y Jardín',
    icon: '🏠',
    description: 'Todo para tu hogar y jardín',
    subcategories: {
      electrodomesticos: {
        id: 'electrodomesticos',
        name: 'Electrodomésticos',
        description: 'Electrodomésticos para cocina y hogar',
        brands: ['LG', 'Samsung', 'Whirlpool', 'Electrolux', 'Bosch'],
        filters: ['Tipo', 'Capacidad', 'Eficiencia energética', 'Color']
      },
      muebles: {
        id: 'muebles',
        name: 'Muebles',
        description: 'Muebles para sala, comedor y dormitorio',
        brands: ['IKEA', 'Jamar', 'Tugó', 'Sodimac'],
        filters: ['Habitación', 'Material', 'Color', 'Estilo']
      },
      decoracion: {
        id: 'decoracion',
        name: 'Decoración',
        description: 'Elementos decorativos y de ambientación',
        brands: ['Home Sentry', 'Falabella HOME', 'Zara Home'],
        filters: ['Estilo', 'Material', 'Color', 'Tamaño']
      },
      cocina: {
        id: 'cocina',
        name: 'Cocina',
        description: 'Utensilios y accesorios para cocina',
        brands: ['Oster', 'Black+Decker', 'Cuisinart', 'T-fal'],
        filters: ['Tipo', 'Material', 'Capacidad', 'Uso']
      },
      jardin: {
        id: 'jardin',
        name: 'Jardín',
        description: 'Herramientas y accesorios para jardín',
        brands: ['Black+Decker', 'Truper', 'Corona', 'Fiskars'],
        filters: ['Tipo', 'Uso', 'Material', 'Tamaño']
      }
    }
  },

  deportes: {
    id: 'deportes',
    name: 'Deportes y Fitness',
    icon: '⚽',
    description: 'Equipos deportivos y fitness',
    subcategories: {
      fitness: {
        id: 'fitness',
        name: 'Fitness',
        description: 'Equipos de ejercicio y gimnasio',
        brands: ['Nike', 'Adidas', 'Under Armour', 'Reebok', 'Puma'],
        filters: ['Tipo de ejercicio', 'Nivel', 'Material', 'Peso']
      },
      futbol: {
        id: 'futbol',
        name: 'Fútbol',
        description: 'Equipos y accesorios de fútbol',
        brands: ['Nike', 'Adidas', 'Puma', 'Umbro', 'Kappa'],
        filters: ['Posición', 'Talla', 'Superficie', 'Liga']
      },
      basketball: {
        id: 'basketball',
        name: 'Basketball',
        description: 'Equipos y accesorios de basketball',
        brands: ['Nike', 'Adidas', 'Jordan', 'Spalding', 'Wilson'],
        filters: ['Posición', 'Talla', 'Tipo de cancha', 'Nivel']
      },
      ciclismo: {
        id: 'ciclismo',
        name: 'Ciclismo',
        description: 'Bicicletas y accesorios',
        brands: ['Trek', 'Specialized', 'Giant', 'Cannondale', 'Scott'],
        filters: ['Tipo de bici', 'Talla', 'Material', 'Uso']
      },
      natacion: {
        id: 'natacion',
        name: 'Natación',
        description: 'Equipos de natación y deportes acuáticos',
        brands: ['Speedo', 'Arena', 'TYR', 'Zoggs'],
        filters: ['Tipo', 'Talla', 'Nivel', 'Uso']
      }
    }
  },

  moda: {
    id: 'moda',
    name: 'Moda y Ropa',
    icon: '👕',
    description: 'Ropa y accesorios de moda',
    subcategories: {
      hombre: {
        id: 'hombre',
        name: 'Hombre',
        description: 'Ropa para hombre',
        brands: ['Zara', 'H&M', 'Nike', 'Adidas', 'Lacoste'],
        filters: ['Tipo', 'Talla', 'Color', 'Estilo', 'Ocasión']
      },
      mujer: {
        id: 'mujer',
        name: 'Mujer',
        description: 'Ropa para mujer',
        brands: ['Zara', 'H&M', 'Mango', 'Forever 21', 'Nike'],
        filters: ['Tipo', 'Talla', 'Color', 'Estilo', 'Ocasión']
      },
      ninos: {
        id: 'ninos',
        name: 'Niños',
        description: 'Ropa para niños y bebés',
        brands: ['Carter\'s', 'OshKosh', 'Disney', 'Nike Kids'],
        filters: ['Edad', 'Talla', 'Género', 'Tipo', 'Color']
      },
      zapatos: {
        id: 'zapatos',
        name: 'Zapatos',
        description: 'Calzado para toda la familia',
        brands: ['Nike', 'Adidas', 'Converse', 'Vans', 'Puma'],
        filters: ['Género', 'Talla', 'Tipo', 'Color', 'Material']
      },
      accesorios_moda: {
        id: 'accesorios_moda',
        name: 'Accesorios',
        description: 'Bolsos, relojes, joyas y más',
        brands: ['Michael Kors', 'Fossil', 'Pandora', 'Swarovski'],
        filters: ['Tipo', 'Material', 'Color', 'Género', 'Ocasión']
      }
    }
  },

  libros: {
    id: 'libros',
    name: 'Libros y Media',
    icon: '📚',
    description: 'Libros, audiolibros y contenido educativo',
    subcategories: {
      ficcion: {
        id: 'ficcion',
        name: 'Ficción',
        description: 'Novelas y literatura de ficción',
        brands: ['Planeta', 'Penguin', 'Alfaguara', 'Seix Barral'],
        filters: ['Género', 'Autor', 'Idioma', 'Año', 'Editorial']
      },
      no_ficcion: {
        id: 'no_ficcion',
        name: 'No Ficción',
        description: 'Biografías, historia, ciencia',
        brands: ['Planeta', 'Penguin', 'National Geographic'],
        filters: ['Tema', 'Autor', 'Idioma', 'Año', 'Editorial']
      },
      educativos: {
        id: 'educativos',
        name: 'Educativos',
        description: 'Libros de texto y material educativo',
        brands: ['McGraw-Hill', 'Pearson', 'Santillana', 'Norma'],
        filters: ['Nivel educativo', 'Materia', 'Idioma', 'Editorial']
      },
      comics: {
        id: 'comics',
        name: 'Comics y Manga',
        description: 'Comics, manga y novelas gráficas',
        brands: ['Marvel', 'DC Comics', 'Panini', 'Planeta DeAgostini'],
        filters: ['Tipo', 'Serie', 'Género', 'Edad', 'Editorial']
      }
    }
  },

  salud: {
    id: 'salud',
    name: 'Salud y Belleza',
    icon: '💊',
    description: 'Productos de salud y cuidado personal',
    subcategories: {
      vitaminas: {
        id: 'vitaminas',
        name: 'Vitaminas y Suplementos',
        description: 'Vitaminas y suplementos nutricionales',
        brands: ['Centrum', 'Nature\'s Bounty', 'GNC', 'Pharmaton'],
        filters: ['Tipo', 'Edad', 'Género', 'Función', 'Forma']
      },
      belleza: {
        id: 'belleza',
        name: 'Belleza',
        description: 'Maquillaje y productos de belleza',
        brands: ['L\'Oréal', 'Maybelline', 'MAC', 'Clinique'],
        filters: ['Tipo de producto', 'Marca', 'Tono', 'Tipo de piel']
      },
      cuidado_personal: {
        id: 'cuidado_personal',
        name: 'Cuidado Personal',
        description: 'Productos de higiene y cuidado personal',
        brands: ['Nivea', 'Dove', 'Neutrogena', 'Gillette'],
        filters: ['Tipo', 'Género', 'Tipo de piel', 'Edad']
      },
      equipos_salud: {
        id: 'equipos_salud',
        name: 'Equipos de Salud',
        description: 'Tensiómetros, termómetros y equipos médicos',
        brands: ['Omron', 'Beurer', 'Microlife', 'Braun'],
        filters: ['Tipo', 'Función', 'Portabilidad', 'Precisión']
      }
    }
  }
};

// Función para obtener todas las categorías principales
export const getMainCategories = () => {
  return Object.values(categories);
};

// Función para obtener subcategorías de una categoría
export const getSubcategories = (categoryId) => {
  return categories[categoryId]?.subcategories ? Object.values(categories[categoryId].subcategories) : [];
};

// Función para obtener una categoría específica
export const getCategory = (categoryId) => {
  return categories[categoryId];
};

// Función para obtener una subcategoría específica
export const getSubcategory = (categoryId, subcategoryId) => {
  return categories[categoryId]?.subcategories?.[subcategoryId];
};

// Función para buscar categorías por nombre
export const searchCategories = (searchTerm) => {
  const results = [];
  const term = searchTerm.toLowerCase();
  
  Object.values(categories).forEach(category => {
    // Buscar en categoría principal
    if (category.name.toLowerCase().includes(term)) {
      results.push({
        type: 'category',
        category: category,
        match: category.name
      });
    }
    
    // Buscar en subcategorías
    if (category.subcategories) {
      Object.values(category.subcategories).forEach(subcategory => {
        if (subcategory.name.toLowerCase().includes(term)) {
          results.push({
            type: 'subcategory',
            category: category,
            subcategory: subcategory,
            match: `${category.name} > ${subcategory.name}`
          });
        }
      });
    }
  });
  
  return results;
};

// Función para obtener todas las marcas únicas
export const getAllBrands = () => {
  const brandsSet = new Set();
  
  Object.values(categories).forEach(category => {
    if (category.subcategories) {
      Object.values(category.subcategories).forEach(subcategory => {
        if (subcategory.brands) {
          subcategory.brands.forEach(brand => brandsSet.add(brand));
        }
      });
    }
  });
  
  return Array.from(brandsSet).sort();
};

// Función para obtener marcas de una categoría específica
export const getBrandsByCategory = (categoryId) => {
  const brandsSet = new Set();
  const category = categories[categoryId];
  
  if (category && category.subcategories) {
    Object.values(category.subcategories).forEach(subcategory => {
      if (subcategory.brands) {
        subcategory.brands.forEach(brand => brandsSet.add(brand));
      }
    });
  }
  
  return Array.from(brandsSet).sort();
};

// Función para obtener la ruta de navegación (breadcrumb)
export const getCategoryBreadcrumb = (categoryId, subcategoryId = null) => {
  const breadcrumb = [];
  const category = categories[categoryId];
  
  if (category) {
    breadcrumb.push({
      id: categoryId,
      name: category.name,
      type: 'category'
    });
    
    if (subcategoryId && category.subcategories && category.subcategories[subcategoryId]) {
      breadcrumb.push({
        id: subcategoryId,
        name: category.subcategories[subcategoryId].name,
        type: 'subcategory'
      });
    }
  }
  
  return breadcrumb;
};

// Configuración de filtros por defecto
export const defaultFilters = {
  priceRange: [0, 10000000],
  brands: [],
  rating: 0,
  inStock: false,
  sortBy: 'relevance' // relevance, price_asc, price_desc, rating, newest
};

// Exportar todo como default también
export default {
  categories,
  getMainCategories,
  getSubcategories,
  getCategory,
  getSubcategory,
  searchCategories,
  getAllBrands,
  getBrandsByCategory,
  getCategoryBreadcrumb,
  defaultFilters
};