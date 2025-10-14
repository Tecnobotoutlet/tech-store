// src/utils/slugify.js
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalizar caracteres con acentos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno solo
    .substring(0, 100); // Limitar longitud
};

// Generar slug único agregando ID si es necesario
export const generateUniqueSlug = (name, id = null) => {
  const baseSlug = slugify(name);
  if (id) {
    return `${baseSlug}-${id}`;
  }
  return baseSlug;
};