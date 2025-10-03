import React, { useMemo } from 'react';
import { useCategories } from '../../context/CategoryContext'; // 🔥 NUEVO
import FocusedInput from '../FocusedInput';
import { X, Save } from 'lucide-react';

const ProductFormModal = ({
  showModal,
  modalMode,
  selectedProduct,
  formData,
  formErrors,
  onClose,
  onSave,
  onInputChange,
  formatCurrency,
  BRANDS
}) => {
  // 🔥 OBTENER CATEGORÍAS DESDE SUPABASE
  const { categories, loading: loadingCategories } = useCategories();

  // 🔥 PREPARAR LISTA DE CATEGORÍAS PRINCIPALES
  const mainCategories = useMemo(() => {
    return Object.values(categories).filter(cat => !cat.parentId);
  }, [categories]);

  // 🔥 PREPARAR LISTA DE SUBCATEGORÍAS SEGÚN LA CATEGORÍA SELECCIONADA
  const availableSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    
    const selectedCategory = mainCategories.find(cat => cat.dbId === parseInt(formData.categoryId));
    if (!selectedCategory || !selectedCategory.subcategories) return [];
    
    return Object.values(selectedCategory.subcategories);
  }, [formData.categoryId, mainCategories]);

  // 🔥 MANEJAR CAMBIO DE CATEGORÍA
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const selectedCategory = mainCategories.find(cat => cat.dbId === parseInt(categoryId));
    
    onInputChange({
      target: {
        name: 'categoryId',
        value: categoryId
      }
    });
    
    // También actualizar el nombre de la categoría
    onInputChange({
      target: {
        name: 'categoryName',
        value: selectedCategory?.name || ''
      }
    });
    
    // Limpiar subcategoría cuando cambie la categoría
    onInputChange({
      target: {
        name: 'subcategoryId',
        value: ''
      }
    });
    onInputChange({
      target: {
        name: 'subcategoryName',
        value: ''
      }
    });
  };

  // 🔥 MANEJAR CAMBIO DE SUBCATEGORÍA
  const handleSubcategoryChange = (e) => {
    const subcategoryId = e.target.value;
    const selectedSubcategory = availableSubcategories.find(sub => sub.dbId === parseInt(subcategoryId));
    
    onInputChange({
      target: {
        name: 'subcategoryId',
        value: subcategoryId
      }
    });
    
    // También actualizar el nombre de la subcategoría
    onInputChange({
      target: {
        name: 'subcategoryName',
        value: selectedSubcategory?.name || ''
      }
    });
  };

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

        {/* Content */}
        <div className="p-6">
          {modalMode !== 'view' && (
            <form className="space-y-6">
              {/* Información Básica */}
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
                      Marca *
                    </label>
                    <FocusedInput
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={onInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.brand ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ej: Apple, Samsung"
                    />
                    {formErrors.brand && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo
                    </label>
                    <FocusedInput
                      type="text"
                      name="model"
                      value={formData.model || ''}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Galaxy S24 Ultra"
                    />
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
                      Precio Original
                    </label>
                    <FocusedInput
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice || ''}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2000000"
                    />
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

              {/* 🔥 CATEGORIZACIÓN - NUEVO */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Categorización</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Categoría Principal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría Principal *
                    </label>
                    {loadingCategories ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
                        Cargando categorías...
                      </div>
                    ) : (
                      <select
                        name="categoryId"
                        value={formData.categoryId || ''}
                        onChange={handleCategoryChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Seleccionar categoría</option>
                        {mainCategories.map(category => (
                          <option key={category.dbId} value={category.dbId}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                    {formErrors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
                    )}
                  </div>

                  {/* Subcategoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategoría {availableSubcategories.length > 0 && '*'}
                    </label>
                    {!formData.categoryId ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                        Selecciona una categoría primero
                      </div>
                    ) : availableSubcategories.length === 0 ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
                        No hay subcategorías disponibles
                      </div>
                    ) : (
                      <select
                        name="subcategoryId"
                        value={formData.subcategoryId || ''}
                        onChange={handleSubcategoryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar subcategoría</option>
                        {availableSubcategories.map(subcategory => (
                          <option key={subcategory.dbId} value={subcategory.dbId}>
                            {subcategory.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                </div>

                {/* Vista previa de la categorización */}
                {formData.categoryName && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Vista previa:</span> {formData.categoryName}
                      {formData.subcategoryName && ` → ${formData.subcategoryName}`}
                    </p>
                  </div>
                )}
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
