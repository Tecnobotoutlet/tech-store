import { useState, useMemo } from 'react';

const useProductFilters = (products) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  // Función para filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => {
        const searchableText = [
          product.name,
          product.category,
          product.categoryName,
          product.brand,
          product.description,
          ...product.specifications?.map(spec => spec.value) || [],
          ...product.tags || []
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }

    // 🔥 FILTRO POR CATEGORÍAS MEJORADO
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        // Buscar coincidencia en múltiples campos
        const productCategories = [
          product.category,           // Slug de categoría (ej: "tecnologia")
          product.categoryName,       // Nombre de categoría (ej: "Tecnología")
          product.subcategory,        // Slug de subcategoría (ej: "smartphones")
          product.subcategoryName     // Nombre de subcategoría (ej: "Smartphones")
        ].filter(Boolean); // Eliminar valores null/undefined

        // Verificar si alguna categoría seleccionada coincide
        return selectedCategories.some(selectedCat => {
          const selectedLower = selectedCat.toLowerCase();
          
          return productCategories.some(prodCat => {
            if (!prodCat) return false;
            const prodLower = prodCat.toLowerCase();
            
            // Coincidencia exacta o parcial
            return prodLower === selectedLower || 
                   prodLower.includes(selectedLower) ||
                   selectedLower.includes(prodLower);
          });
        });
      });
    }

    // Filtro por rango de precios
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filtro por calificación
    if (minRating > 0) {
      filtered = filtered.filter(product => product.rating >= minRating);
    }

    // Filtro por disponibilidad
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Ordenamiento
    switch (sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => {
          // Primero productos nuevos, luego por ID descendente
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.id - a.id;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          // Primero productos destacados, luego por rating
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return filtered;
  }, [
    products, 
    searchTerm, 
    selectedCategories, 
    priceRange, 
    minRating, 
    sortBy, 
    showOnlyInStock
  ]);

  // Estadísticas de filtros
  const filterStats = useMemo(() => {
    const total = products.length;
    const filtered = filteredProducts.length;
    const categories = [...new Set(products.map(p => p.categoryName || p.category))];
    
    const categoryStats = categories.map(category => ({
      name: category,
      count: products.filter(p => 
        p.category === category || 
        p.categoryName === category
      ).length,
      filteredCount: filteredProducts.filter(p => 
        p.category === category || 
        p.categoryName === category
      ).length
    }));

    const priceStats = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
      average: products.reduce((sum, p) => sum + p.price, 0) / products.length
    };

    const ratingStats = {
      average: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
      distribution: [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: products.filter(p => Math.floor(p.rating) === rating).length
      }))
    };

    return {
      total,
      filtered,
      categories: categoryStats,
      price: priceStats,
      rating: ratingStats
    };
  }, [products, filteredProducts]);

  // Funciones para actualizar filtros
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const handleStockFilterChange = (stockOnly) => {
    setShowOnlyInStock(stockOnly);
  };

  // Función para resetear todos los filtros
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 10000000 });
    setMinRating(0);
    setSortBy('featured');
    setShowOnlyInStock(false);
  };

  // Función para aplicar filtros preconfigurados
  const applyPresetFilter = (preset) => {
    switch (preset) {
      case 'gaming':
        setSelectedCategories(['Gaming']);
        setMinRating(4);
        break;
      case 'budget':
        setPriceRange({ min: 0, max: 1000000 });
        setShowOnlyInStock(true);
        break;
      case 'premium':
        setPriceRange({ min: 3000000, max: 10000000 });
        setMinRating(4.5);
        break;
      case 'new-arrivals':
        setSortBy('newest');
        break;
      case 'best-rated':
        setMinRating(4.5);
        setSortBy('rating');
        break;
      default:
        break;
    }
  };

  return {
    // Productos filtrados
    filteredProducts,
    
    // Estados de filtros
    searchTerm,
    selectedCategories,
    priceRange,
    minRating,
    sortBy,
    showOnlyInStock,
    
    // Estadísticas
    filterStats,
    
    // Funciones de control
    handleSearchChange,
    handleCategoryChange,
    handlePriceRangeChange,
    handleRatingChange,
    handleSortChange,
    handleStockFilterChange,
    resetFilters,
    applyPresetFilter
  };
};

export default useProductFilters;
