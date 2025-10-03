// src/context/CategoryContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { categoryService } from '../services/categoryService';

const CategoryContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar categorías desde Supabase
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Error al cargar categorías');
      setCategories({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Obtener lista plana de todas las categorías principales
  const getCategoryList = useCallback(() => {
    return Object.values(categories).map(cat => ({
      id: cat.slug,
      name: cat.name,
      icon: cat.icon
    }));
  }, [categories]);

  // Obtener lista de todas las categorías y subcategorías
  const getAllCategoryNames = useCallback(() => {
    const names = [];
    Object.values(categories).forEach(category => {
      names.push(category.name);
      if (category.subcategories) {
        Object.values(category.subcategories).forEach(subcat => {
          names.push(subcat.name);
        });
      }
    });
    return names;
  }, [categories]);

  // Obtener categorías para filtros (solo activas)
  const getFilterCategories = useCallback(() => {
    return Object.values(categories)
      .filter(cat => cat.isActive !== false)
      .map(cat => ({
        id: cat.slug,
        name: cat.name,
        icon: cat.icon,
        subcategories: Object.values(cat.subcategories || {})
          .filter(sub => sub.isActive !== false)
          .map(sub => ({
            id: sub.slug,
            name: sub.name
          }))
      }));
  }, [categories]);

  // Buscar categoría por slug o nombre
  const findCategory = useCallback((searchTerm) => {
    const term = searchTerm.toLowerCase();
    
    for (const category of Object.values(categories)) {
      if (category.slug === term || category.name.toLowerCase() === term) {
        return category;
      }
      
      if (category.subcategories) {
        for (const subcat of Object.values(category.subcategories)) {
          if (subcat.slug === term || subcat.name.toLowerCase() === term) {
            return subcat;
          }
        }
      }
    }
    return null;
  }, [categories]);

  // Refrescar categorías
  const refreshCategories = useCallback(() => {
    fetchCategories();
  }, [fetchCategories]);

  const value = useMemo(() => ({
    categories,
    loading,
    error,
    fetchCategories,
    refreshCategories,
    getCategoryList,
    getAllCategoryNames,
    getFilterCategories,
    findCategory
  }), [
    categories,
    loading,
    error,
    fetchCategories,
    refreshCategories,
    getCategoryList,
    getAllCategoryNames,
    getFilterCategories,
    findCategory
  ]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};