// src/context/ProductContext.js - CON DEBUGGING
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useCategories } from './CategoryContext';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { categories } = useCategories();

  // 🔥 DEBUGGING: Ver qué categorías se cargan
  useEffect(() => {
    console.log('🟢 Categorías cargadas:', categories);
    console.log('🟢 Número de categorías:', Object.keys(categories).length);
    
    // Listar todas las subcategorías
    Object.entries(categories).forEach(([key, category]) => {
      console.log(`📁 Categoría: ${category.name} (${key})`);
      if (category.subcategories) {
        Object.entries(category.subcategories).forEach(([subKey, subcat]) => {
          console.log(`  📂 Subcategoría: ${subcat.name} (dbId: ${subcat.dbId})`);
        });
      }
    });
  }, [categories]);

   // 🔥 FUNCIÓN PARA BUSCAR NOMBRE DE SUBCATEGORÍA
  const getSubcategoryName = useCallback((subcategoryId) => {
    if (!subcategoryId) return null;
    
    console.log(`🔍 Buscando subcategoría con ID: ${subcategoryId}`);
    
    for (const category of Object.values(categories)) {
      if (category.subcategories) {
        for (const subcat of Object.values(category.subcategories)) {
          console.log(`  🔎 Comparando: subcat.dbId=${subcat.dbId} con subcategoryId=${subcategoryId}`);
          if (subcat.dbId === subcategoryId) {
            console.log(`  ✅ ENCONTRADO: ${subcat.name}`);
            return subcat.name;
          }
        }
      }
    }
    console.log(`  ❌ NO ENCONTRADO para ID: ${subcategoryId}`);
    return null;
  }, [categories]);

  
  // Función para normalizar productos de Supabase
  const normalizeProduct = useCallback((product) => {
    const subcatName = getSubcategoryName(product.subcategory_id);
    
    console.log(`🔄 Normalizando producto: ${product.name}`);
    console.log(`  subcategory_id: ${product.subcategory_id}`);
    console.log(`  subcategoryName resuelto: ${subcatName}`);
    
    return {
      id: parseInt(product.id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      category: product.category,
      categoryName: product.category_name || product.category,
      categoryId: product.category_id,
      subcategoryId: product.subcategory_id,
      subcategoryName: subcatName, // 🔥 USAR EL NOMBRE RESUELTO
      subcategory: null,
      
      brand: product.brand,
      model: product.model,
      stock: product.stock_quantity,
      stockQuantity: product.stock_quantity,
      image: product.image,
      images: Array.isArray(product.images) ? product.images : [],
      isActive: product.is_active !== false,
      isFeatured: product.is_featured || false,
      isNew: product.is_new || false,
      isFromAdmin: product.is_from_admin || false,
      inStock: product.stock_quantity > 0,
      discount: product.discount || 0,
      rating: parseFloat(product.rating || 4.5),
      reviews: product.reviews || 0,
      tags: Array.isArray(product.tags) ? product.tags : [],
      warranty: product.warranty || '12 meses de garantía',
      shipping: product.shipping || 'Envío gratis en 24-48 horas',
      specifications: Array.isArray(product.specifications) ? product.specifications : [],
      features: Array.isArray(product.features) ? product.features : [],
      variants: Array.isArray(product.variants) ? product.variants : [],
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
  }, [getSubcategoryName]);

  // Cargar productos desde Supabase
  const fetchProducts = useCallback(async () => {
    console.log('📥 fetchProducts LLAMADO', new Date().toISOString());
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const normalizedProducts = (data || []).map(normalizeProduct);
      setProducts(normalizedProducts);
      
      console.log('✅ Productos cargados:', normalizedProducts.length);
      console.log('🔍 Primer producto con subcategoría:', 
        normalizedProducts.find(p => p.subcategoryId !== null)
      );
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  // Cargar productos al inicializar
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // AGREGAR PRODUCTO - SIN CAMPOS INEXISTENTES
  const addProduct = useCallback(async (productData) => {
    console.log('🔵 addProduct INICIADO', {
      timestamp: new Date().toISOString(),
      productName: productData.name,
      categoryId: productData.categoryId,
      subcategoryId: productData.subcategoryId
    });
    
    setLoading(true);
    setError(null);
    try {
      const dbData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        
        category: productData.category || productData.categoryName?.toLowerCase().replace(/\s+/g, '-'),
        category_name: productData.categoryName,
        category_id: productData.categoryId ? parseInt(productData.categoryId) : null,
        subcategory_id: productData.subcategoryId ? parseInt(productData.subcategoryId) : null,
        
        brand: productData.brand,
        model: productData.model || null,
        stock_quantity: parseInt(productData.stockQuantity || productData.stock || 0),
        image: productData.images?.[0] || productData.image || null,
        images: productData.images || [],
        is_active: productData.isActive !== false,
        is_featured: productData.isFeatured || false,
        is_new: productData.isNew || false,
        is_from_admin: true,
        discount: productData.discount || 0,
        rating: parseFloat(productData.rating || 4.5),
        reviews: parseInt(productData.reviews || 0),
        tags: productData.tags || [],
        warranty: productData.warranty || '12 meses de garantía',
        shipping: productData.shipping || 'Envío gratis en 24-48 horas',
        specifications: productData.specifications || [],
        features: productData.features || [],
        variants: productData.variants || []
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      const newProduct = normalizeProduct(data);
      setProducts(prev => {
        const yaExiste = prev.find(p => p.id === newProduct.id);
        if (yaExiste) return prev;
        return [newProduct, ...prev];
      });

      return newProduct;
    } catch (error) {
      console.error('❌ Error adding product:', error);
      setError('Error al agregar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  // ACTUALIZAR PRODUCTO
  const updateProduct = useCallback(async (productId, productData) => {
    setLoading(true);
    setError(null);
    try {
      const dbData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        
        category: productData.category || productData.categoryName?.toLowerCase().replace(/\s+/g, '-'),
        category_name: productData.categoryName,
        category_id: productData.categoryId ? parseInt(productData.categoryId) : null,
        subcategory_id: productData.subcategoryId ? parseInt(productData.subcategoryId) : null,
        
        brand: productData.brand,
        model: productData.model || null,
        stock_quantity: parseInt(productData.stockQuantity || productData.stock || 0),
        image: productData.images?.[0] || productData.image || null,
        images: productData.images || [],
        is_active: productData.isActive !== false,
        is_featured: productData.isFeatured || false,
        is_new: productData.isNew || false,
        discount: productData.discount || 0,
        rating: parseFloat(productData.rating || 4.5),
        reviews: parseInt(productData.reviews || 0),
        tags: productData.tags || [],
        warranty: productData.warranty || '12 meses de garantía',
        shipping: productData.shipping || 'Envío gratis en 24-48 horas',
        specifications: productData.specifications || [],
        features: productData.features || [],
        variants: productData.variants || [],
        is_from_admin: true,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .update(dbData)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;

      const updatedProduct = normalizeProduct(data);
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));

      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error al actualizar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  const deleteProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Error al eliminar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProductById = useCallback((id) => {
    return products.find(product => product.id === parseInt(id));
  }, [products]);

  const getProductsByCategory = useCallback((categoryId, subcategoryId = null) => {
    return products.filter(product => {
      if (subcategoryId) {
        return product.categoryId === categoryId && product.subcategoryId === subcategoryId;
      }
      return product.categoryId === categoryId;
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
      product.description?.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.categoryName?.toLowerCase().includes(term) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  }, [products]);

  const getProductStats = useCallback(() => {
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.stockQuantity > 0).length;
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
      inStock: inStockProducts,
      outOfStock: outOfStockProducts,
      featured: featuredProducts,
      discounted: discountedProducts,
      byCategory: categoryStats
    };
  }, [products]);

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
