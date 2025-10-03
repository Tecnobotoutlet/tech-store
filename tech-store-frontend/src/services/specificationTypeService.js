// src/services/specificationTypeService.js

import { supabase } from '../supabaseClient';

// Obtener todos los tipos de especificaciones
export const getAllSpecificationTypes = async (category = null) => {
  try {
    let query = supabase
      .from('specification_types')
      .select('*')
      .eq('is_active', true)
      .order('label', { ascending: true });

    // Filtrar por categoría si se proporciona
    if (category) {
      query = query.or(`category.eq.${category},category.is.null`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching specification types:', error);
    throw error;
  }
};

// Obtener tipos de especificaciones por categoría
export const getSpecificationTypesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('specification_types')
      .select('*')
      .eq('is_active', true)
      .or(`category.eq.${category},category.is.null`)
      .order('label', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching specification types by category:', error);
    throw error;
  }
};

// Crear nuevo tipo de especificación
export const createSpecificationType = async (specData) => {
  try {
    // Crear el tipo a partir del label (sin espacios, lowercase)
    const type = specData.label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_');

    const { data, error } = await supabase
      .from('specification_types')
      .insert([{
        type: type,
        label: specData.label.trim(),
        category: specData.category || null,
        placeholder: specData.placeholder || null,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      // Si el tipo ya existe, intentar con timestamp
      if (error.code === '23505') {
        const timestamp = Date.now();
        const newType = `${type}_${timestamp}`;
        
        const { data: retryData, error: retryError } = await supabase
          .from('specification_types')
          .insert([{
            type: newType,
            label: specData.label.trim(),
            category: specData.category || null,
            placeholder: specData.placeholder || null,
            is_active: true
          }])
          .select()
          .single();
        
        if (retryError) throw retryError;
        return retryData;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating specification type:', error);
    throw error;
  }
};

// Actualizar tipo de especificación
export const updateSpecificationType = async (id, specData) => {
  try {
    const { data, error } = await supabase
      .from('specification_types')
      .update({
        label: specData.label.trim(),
        category: specData.category || null,
        placeholder: specData.placeholder || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating specification type:', error);
    throw error;
  }
};

// Eliminar tipo de especificación (soft delete)
export const deleteSpecificationType = async (id) => {
  try {
    const { data, error } = await supabase
      .from('specification_types')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting specification type:', error);
    throw error;
  }
};

// Buscar tipos de especificación por nombre
export const searchSpecificationTypes = async (searchTerm, category = null) => {
  try {
    let query = supabase
      .from('specification_types')
      .select('*')
      .eq('is_active', true)
      .ilike('label', `%${searchTerm}%`)
      .order('label', { ascending: true });

    if (category) {
      query = query.or(`category.eq.${category},category.is.null`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching specification types:', error);
    throw error;
  }
};