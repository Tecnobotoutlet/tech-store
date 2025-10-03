// src/components/admin/AddSpecificationModal.js

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const AddSpecificationModal = ({ isOpen, onClose, onSave, currentCategory }) => {
  const [specData, setSpecData] = useState({
    label: '',
    category: currentCategory || '',
    placeholder: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpecData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!specData.label.trim()) {
      newErrors.label = 'El nombre de la especificación es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSaving(true);
    try {
      await onSave(specData);
      // Limpiar formulario
      setSpecData({
        label: '',
        category: currentCategory || '',
        placeholder: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Error al crear la especificación' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSpecData({
      label: '',
      category: currentCategory || '',
      placeholder: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">Agregar Nueva Especificación</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Etiqueta/Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Especificación *
            </label>
            <input
              type="text"
              name="label"
              value={specData.label}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.label ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Resolución de pantalla"
            />
            {errors.label && (
              <p className="text-red-500 text-sm mt-1">{errors.label}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Este es el nombre que se mostrará en el formulario
            </p>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría (opcional)
            </label>
            <select
              name="category"
              value={specData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="tecnologia">Tecnología</option>
              <option value="moda">Moda y Ropa</option>
              <option value="calzado">Calzado</option>
              <option value="hogar">Hogar y Jardín</option>
              <option value="deportes">Deportes y Fitness</option>
              <option value="salud">Salud y Belleza</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Si seleccionas una categoría, solo aparecerá para productos de esa categoría
            </p>
          </div>

          {/* Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Texto de ayuda (opcional)
            </label>
            <input
              type="text"
              name="placeholder"
              value={specData.placeholder}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 1920x1080, 2560x1440"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplos que se mostrarán como ayuda al usuario
            </p>
          </div>

          {/* Error general */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Especificación
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpecificationModal;