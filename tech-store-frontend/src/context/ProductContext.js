// src/context/ProductContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { sampleProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  // Inicializar con productos existentes + productos del localStorage
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('adminProducts');
    const adminProducts = savedProducts ? JSON.parse(savedProducts) : [];
    
    // Combinar productos estáticos con productos del admin
    // Los productos del admin tienen IDs mayores para evitar conflictos
    const maxStaticId = Math.max(...sampleProducts.map(p => p.id));
    const adjustedAdminProducts = adminProducts.map(product => ({
      ...product,
      id: product.id > maxStaticId ? product.id : maxStaticId + product.id,
      isFromAdmin: true // Flag para identificar productos del admin
    }));
    
    return [...sampleProducts, ...adjustedAdminProducts];
  });

  // Guardar productos del admin en localStorage cuando cambien
  useEffect(() => {
    const adminProducts = products.filter(p => p.isFromAdmin);
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
  }, [products]);

  // Funciones memoizadas para manejar productos
  const addProduct = useCallback((productData) => {
    const maxId = Math.max(...products.map(p => p.id), 0);
    const newProduct = {
      ...productData,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      isFromAdmin: true
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, [products]);

  const updateProduct = useCallback((productId, productData) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, ...productData, updatedAt: new Date().toISOString() }
        : product
    ));
  }, []);

  const deleteProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  }, []);

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
    return products.filter(product => product.isFeatured);
  }, [products]);

  const getNewProducts = useCallback(() => {
    return products.filter(product => product.isNew);
  }, [products]);

  const getDiscountedProducts = useCallback(() => {
    return products.filter(product => product.discount > 0);
  }, [products]);

  const searchProducts = useCallback((searchTerm) => {
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.categoryName?.toLowerCase().includes(term) ||
      product.subcategoryName?.toLowerCase().includes(term) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  }, [products]);

  // Estadísticas para el admin - memoizada
  const getProductStats = useCallback(() => {
    const totalProducts = products.length;
    const adminProducts = products.filter(p => p.isFromAdmin).length;
    const staticProducts = products.filter(p => !p.isFromAdmin).length;
    const inStockProducts = products.filter(p => p.inStock !== false && p.stockQuantity > 0).length;
    const outOfStockProducts = totalProducts - inStockProducts;
    const featuredProducts = products.filter(p => p.isFeatured).length;
    const discountedProducts = products.filter(p => p.discount > 0).length;
    
    const categoryStats = {};
    products.forEach(product => {
      const categoryName = product.categoryName || product.category;
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = 0;
      }
      categoryStats[categoryName]++;
    });
    
    return {
      total: totalProducts,
      admin: adminProducts,
      static: staticProducts,
      inStock: inStockProducts,
      outOfStock: outOfStockProducts,
      featured: featuredProducts,
      discounted: discountedProducts,
      byCategory: categoryStats
    };
  }, [products]);

  // CRÍTICO: Memoizar el objeto value para evitar re-renders
  const value = useMemo(() => ({
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewProducts,
    getDiscountedProducts,
    searchProducts,
    getProductStats
  }), [
    products,
    addProduct,
    updateProduct,
    deleteProduct,
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
