// src/context/ProductContext.js - Actualizado para usar API de Neon
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { sampleProducts } from '../data/products';

const ProductContext = createContext();

// Configuración de la API
const API_BASE_URL = '/api';

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para hacer llamadas a la API
  const apiCall = useCallback(async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  // Función para normalizar productos (backend vs frontend compatibility)
  const normalizeProduct = useCallback((product) => {
    return {
      id: parseInt(product.id),
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      category: product.category,
      categoryName: product.category_name || product.categoryName,
      subcategory: product.subcategory,
      subcategoryName: product.subcategory_name || product.subcategoryName,
      brand: product.brand,
      model: product.model,
      stock: product.stock_quantity || product.stock,
      stockQuantity: product.stock_quantity || product.stockQuantity || product.stock,
      image: product.image,
      images: Array.isArray(product.images) ? product.images : 
              (typeof product.images === 'string' ? JSON.parse(product.images) : [product.image || '']),
      isActive: product.is_active !== false && product.isActive !== false,
      isFeatured: product.is_featured || product.isFeatured,
      isNew: product.is_new || product.isNew,
      inStock: product.in_stock !== false && product.inStock !== false,
      discount: product.discount || 0,
      rating: parseFloat(product.rating || 4.5),
      reviews: product.reviews || 0,
      totalReviews: product.total_reviews || product.totalReviews || product.reviews || 0,
      tags: Array.isArray(product.tags) ? product.tags : 
            (typeof product.tags === 'string' ? JSON.parse(product.tags) : []),
      warranty: product.warranty || '12 meses de garantía',
      shipping: product.shipping || 'Envío gratis en 24-48 horas',
      specifications: Array.isArray(product.specifications) ? product.specifications : 
                     (typeof product.specifications === 'string' ? JSON.parse(product.specifications) : []),
      features: Array.isArray(product.features) ? product.features : 
               (typeof product.features === 'string' ? JSON.parse(product.features) : []),
      variants: Array.isArray(product.variants) ? product.variants : 
               (typeof product.variants === 'string' ? JSON.parse(product.variants) : []),
      createdAt: product.created_at || product.createdAt,
      updatedAt: product.updated_at || product.updatedAt,
      isFromAdmin: !!(product.created_at || product.createdAt) // Si tiene timestamp, es de la API
    };
  }, []);

  // Invalidar cache del service worker
  const invalidateServiceWorkerCache = useCallback(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'INVALIDATE_CACHE',
        url: `${API_BASE_URL}/products`
      });
    }
  }, []);

  // Cargar productos desde la API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall('/products');
      const apiProducts = response.data || [];
      
      // Normalizar productos de la API
      const normalizedApiProducts = apiProducts.map(normalizeProduct);
      
      // Combinar productos estáticos con productos de la API
      const allProducts = [...sampleProducts, ...normalizedApiProducts];
      setProducts(allProducts);
      
      // Invalidar cache del service worker
      invalidateServiceWorkerCache();
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar productos desde el servidor');
      // Mantener productos estáticos si falla la API
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  }, [apiCall, normalizeProduct, invalidateServiceWorkerCache]);

  // Cargar productos al inicializar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Agregar producto
  const addProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    try {
      // Preparar datos para el backend
      const backendData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        category: productData.category,
        category_name: productData.categoryName || productData.category,
        subcategory: productData.subcategory || productData.category,
        subcategory_name: productData.subcategoryName || productData.categoryName || productData.category,
        brand: productData.brand,
        model: productData.model || null,
        stock: parseInt(productData.stockQuantity || productData.stock || 0),
        stock_quantity: parseInt(productData.stockQuantity || productData.stock || 0),
        image: productData.images?.[0] || productData.image || null,
        images: productData.images || [],
        is_active: productData.isActive !== false,
        is_featured: productData.isFeatured || false,
        is_new: productData.isNew || false,
        in_stock: productData.inStock !== false && parseInt(productData.stockQuantity || productData.stock || 0) > 0,
        discount: productData.discount || 0,
        rating: parseFloat(productData.rating || 4.5),
        reviews: parseInt(productData.reviews || 0),
        total_reviews: parseInt(productData.totalReviews || productData.reviews || 0),
        tags: productData.tags || [],
        warranty: productData.warranty || '12 meses de garantía',
        shipping: productData.shipping || 'Envío gratis en 24-48 horas',
        specifications: productData.specifications || [],
        features: productData.features || [],
        variants: productData.variants || []
      };

      const response = await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(backendData),
      });

      const newProduct = normalizeProduct(response.data);
      
      // Actualizar estado local inmediatamente
      setProducts(prev => [...prev, newProduct]);
      
      // Invalidar cache del service worker
      invalidateServiceWorkerCache();

      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error al agregar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiCall, normalizeProduct, invalidateServiceWorkerCache]);

  // Actualizar producto
  const updateProduct = useCallback(async (productId, productData) => {
    if (!productId) {
      throw new Error('Product ID is required for update');
    }

    // Solo permitir editar productos de la API
    const product = products.find(p => p.id === productId);
    if (!product?.isFromAdmin) {
      throw new Error('Solo puedes editar productos que hayas creado en el panel administrativo.');
    }

    setLoading(true);
    setError(null);
    try {
      // Preparar datos para el backend (similar a addProduct)
      const backendData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        category: productData.category,
        category_name: productData.categoryName || productData.category,
        subcategory: productData.subcategory || productData.category,
        subcategory_name: productData.subcategoryName || productData.categoryName || productData.category,
        brand: productData.brand,
        model: productData.model || null,
        stock: parseInt(productData.stockQuantity || productData.stock || 0),
        stock_quantity: parseInt(productData.stockQuantity || productData.stock || 0),
        image: productData.images?.[0] || productData.image || null,
        images: productData.images || [],
        is_active: productData.isActive !== false,
        is_featured: productData.isFeatured || false,
        is_new: productData.isNew || false,
        in_stock: productData.inStock !== false && parseInt(productData.stockQuantity || productData.stock || 0) > 0,
        discount: productData.discount || 0,
        rating: parseFloat(productData.rating || 4.5),
        reviews: parseInt(productData.reviews || 0),
        total_reviews: parseInt(productData.totalReviews || productData.reviews || 0),
        tags: productData.tags || [],
        warranty: productData.warranty || '12 meses de garantía',
        shipping: productData.shipping || 'Envío gratis en 24-48 horas',
        specifications: productData.specifications || [],
        features: productData.features || [],
        variants: productData.variants || []
      };

      const response = await apiCall(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(backendData),
      });

      const updatedProduct = normalizeProduct(response.data);
      
      // Actualizar estado local
      setProducts(prev => prev.map(product => 
        product.id === productId ? updatedProduct : product
      ));
      
      // Invalidar cache del service worker
      invalidateServiceWorkerCache();

      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error al actualizar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [products, apiCall, normalizeProduct, invalidateServiceWorkerCache]);

  // Eliminar producto
  const deleteProduct = useCallback(async (productId) => {
    if (!productId) {
      throw new Error('Product ID is required for deletion');
    }

    // Solo permitir eliminar productos de la API
    const product = products.find(p => p.id === productId);
    if (!product?.isFromAdmin) {
      throw new Error('Solo puedes eliminar productos que hayas creado en el panel administrativo.');
    }

    setLoading(true);
    setError(null);
    try {
      await apiCall(`/products/${productId}`, {
        method: 'DELETE',
      });
      
      // Actualizar estado local
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      // Invalidar cache del service worker
      invalidateServiceWorkerCache();

    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al eliminar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [products, apiCall, invalidateServiceWorkerCache]);

  // Refrescar productos (útil para sincronización manual)
  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Funciones de consulta (mantener las existentes pero con compatibilidad mejorada)
  const getProductById = useCallback((id) => {
    return products.find(product => product.id === parseInt(id));
  }, [products]);

  const getProductsByCategory = useCallback((categoryId, subcategoryId = null) => {
    return products.filter(product => {
      if (subcategoryId) {
        return product.category === categoryId && product.subcategory === subcategoryId;
      }
      return product.category === categoryId;
    });
  }, [products]);

  const getFeaturedProducts = useCallback(() => {
    return products.filter(product => product.is_featured || product.isFeatured);
  }, [products]);

  const getNewProducts = useCallback(() => {
    return products.filter(product => product.is_new || product.isNew);
  }, [products]);

  const getDiscountedProducts = useCallback(() => {
    return products.filter(product => (product.discount || 0) > 0);
  }, [products]);

  const searchProducts = useCallback((searchTerm) => {
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      (product.category_name || product.categoryName)?.toLowerCase().includes(term) ||
      (product.subcategory_name || product.subcategoryName)?.toLowerCase().includes(term) ||
      (product.tags && product.tags.some(tag => 
        typeof tag === 'string' ? tag.toLowerCase().includes(term) : false
      ))
    );
  }, [products]);

  // Estadísticas para el admin
  const getProductStats = useCallback(() => {
    const totalProducts = products.length;
    const apiProducts = products.filter(p => p.isFromAdmin).length;
    const staticProducts = products.filter(p => !p.isFromAdmin).length;
    const inStockProducts = products.filter(p => 
      (p.in_stock !== false || p.inStock !== false) && 
      (p.stock_quantity || p.stockQuantity || p.stock || 0) > 0
    ).length;
    const outOfStockProducts = totalProducts - inStockProducts;
    const featuredProducts = products.filter(p => p.is_featured || p.isFeatured).length;
    const discountedProducts = products.filter(p => (p.discount || 0) > 0).length;
    
    const categoryStats = {};
    products.forEach(product => {
      const categoryName = product.category_name || product.categoryName || product.category;
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = 0;
      }
      categoryStats[categoryName]++;
    });
    
    return {
      total: totalProducts,
      api: apiProducts,
      static: staticProducts,
      inStock: inStockProducts,
      outOfStock: outOfStockProducts,
      featured: featuredProducts,
      discounted: discountedProducts,
      byCategory: categoryStats
    };
  }, [products]);

  // Valor del contexto memoizado
  const value = useMemo(() => ({
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewProducts,
    getDiscountedProducts,
    searchProducts,
    getProductStats
  }), [
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewProducts,
    getDiscountedProducts,
    searchProducts,
    getProductStats
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
