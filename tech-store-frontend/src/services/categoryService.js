// src/services/categoryService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const categoryService = {
  // Obtener todas las categorías con subcategorías
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Organizar en formato jerárquico
      const categoriesMap = {};
      const rootCategories = [];

      data.forEach(cat => {
        const category = {
          id: cat.slug,
          dbId: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon || '📦',
          description: cat.description || '',
          image: cat.image,
          isActive: cat.is_active,
          displayOrder: cat.display_order,
          parentId: cat.parent_id,
          subcategories: {}
        };

        categoriesMap[cat.id] = category;

        if (!cat.parent_id) {
          rootCategories.push(category);
        }
      });

      // Asociar subcategorías a sus padres
      data.forEach(cat => {
        if (cat.parent_id && categoriesMap[cat.parent_id]) {
          const parent = categoriesMap[cat.parent_id];
          const child = categoriesMap[cat.id];
          parent.subcategories[child.slug] = child;
        }
      });

      // Convertir array a objeto usando slug como key
      const result = {};
      rootCategories.forEach(cat => {
        result[cat.slug] = cat;
      });

      return result;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Crear categoría
  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: categoryData.name,
          slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
          description: categoryData.description,
          icon: categoryData.icon || '📦',
          image: categoryData.image,
          parent_id: categoryData.parentId || null,
          is_active: true,
          display_order: categoryData.displayOrder || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Actualizar categoría
  async updateCategory(categoryId, categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          icon: categoryData.icon,
          image: categoryData.image,
          display_order: categoryData.displayOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Eliminar categoría
  async deleteCategory(categoryId) {
    try {
      // Verificar si tiene subcategorías
      const { data: children } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', categoryId);

      if (children && children.length > 0) {
        throw new Error('No se puede eliminar una categoría con subcategorías');
      }

      // Verificar si tiene productos
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', categoryId)
        .limit(1);

      if (products && products.length > 0) {
        throw new Error('No se puede eliminar una categoría con productos asociados');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Crear subcategoría
  async createSubcategory(parentId, subcategoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: subcategoryData.name,
          slug: subcategoryData.slug || subcategoryData.name.toLowerCase().replace(/\s+/g, '-'),
          description: subcategoryData.description,
          parent_id: parentId,
          is_active: true,
          display_order: subcategoryData.displayOrder || 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating subcategory:', error);
      throw error;
    }
  },

  // Duplicar categoría
  async duplicateCategory(categoryId) {
    try {
      // Obtener categoría original
      const { data: original, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (fetchError) throw fetchError;

      // Crear copia
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: `${original.name} (Copia)`,
          slug: `${original.slug}-copy-${Date.now()}`,
          description: original.description,
          icon: original.icon,
          image: original.image,
          parent_id: original.parent_id,
          is_active: original.is_active,
          display_order: original.display_order + 1
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error duplicating category:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  async getCategoryStats() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, parent_id');

      if (error) throw error;

      const totalCategories = data.filter(c => !c.parent_id).length;
      const totalSubcategories = data.filter(c => c.parent_id).length;

      return {
        totalCategories,
        totalSubcategories,
        total: data.length
      };
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }
};

export default categoryService;