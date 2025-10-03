// src/services/brandService.js

import { supabase } from '../supabaseClient';

// Función para crear slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
};

// Obtener todas las marcas activas
export const getAllBrands = async () => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

// Obtener una marca por ID
export const getBrandById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching brand:', error);
    throw error;
  }
};

// Crear nueva marca
export const createBrand = async (brandData) => {
  try {
    const slug = createSlug(brandData.name);
    
    const { data, error } = await supabase
      .from('brands')
      .insert([{
        name: brandData.name.trim(),
        slug: slug,
        logo_url: brandData.logo_url || null,
        description: brandData.description || null,
        website: brandData.website || null,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      // Si el error es por slug duplicado, intentar con un número
      if (error.code === '23505') {
        const timestamp = Date.now();
        const newSlug = `${slug}-${timestamp}`;
        
        const { data: retryData, error: retryError } = await supabase
          .from('brands')
          .insert([{
            name: brandData.name.trim(),
            slug: newSlug,
            logo_url: brandData.logo_url || null,
            description: brandData.description || null,
            website: brandData.website || null,
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
    console.error('Error creating brand:', error);
    throw error;
  }
};

// Actualizar marca
export const updateBrand = async (id, brandData) => {
  try {
    const updateData = {
      name: brandData.name.trim(),
      logo_url: brandData.logo_url || null,
      description: brandData.description || null,
      website: brandData.website || null,
      updated_at: new Date().toISOString()
    };

    // Si cambió el nombre, actualizar el slug
    if (brandData.name) {
      updateData.slug = createSlug(brandData.name);
    }

    const { data, error } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
};

// Eliminar marca (soft delete)
export const deleteBrand = async (id) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

// Buscar marcas por nombre
export const searchBrands = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${searchTerm}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching brands:', error);
    throw error;
  }
};