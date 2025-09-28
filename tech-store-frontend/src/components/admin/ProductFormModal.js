import React from 'react';
import FocusedInput from '../FocusedInput';
import { X, Save, PlusCircle, MinusCircle } from 'lucide-react';

const ProductFormModal = ({
  showModal,
  modalMode,
  selectedProduct,
  formData,
  formErrors,
  newSpecification,
  newFeature,
  newVariant,
  newTag,
  onClose,
  onSave,
  onInputChange,
  onSpecificationChange,
  onFeatureChange,
  onVariantChange,
  onTagChange,
  onAddSpecification,
  onRemoveSpecification,
  onAddFeature,
  onRemoveFeature,
  onAddVariant,
  onRemoveVariant,
  onAddTag,
  onRemoveTag,
  onUpdateImageField,
  onAddImageField,
  onRemoveImageField,
  formatCurrency,
  getCategoryDisplayName,
  CATEGORIES,
  BRANDS,
  SPECIFICATION_TYPES
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">
            {modalMode === 'add' ? 'Agregar Producto' : 
             modalMode === 'edit' ? 'Editar Producto' : 'Ver Producto'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Solo formulario básico */}
        <div className="p-6">
          {modalMode !== 'view' && (
            <form className="space-y-6">
              {/* Información Básica SOLAMENTE */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <FocusedInput
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: iPhone 15 Pro Max"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio *
                    </label>
                    <FocusedInput
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1500000"
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {CATEGORIES.map(category => (
                        <option key={category} value={category}>{getCategoryDisplayName(category)}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <FocusedInput
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.stockQuantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10"
                    />
                    {formErrors.stockQuantity && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.stockQuantity}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <FocusedInput
                      type="textarea"
                      name="description"
                      value={formData.description}
                      onChange={onInputChange}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Descripción detallada del producto..."
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>

                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          {modalMode !== 'view' && (
            <button
              onClick={onSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Producto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductFormModal);