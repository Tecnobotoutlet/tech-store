// src/components/admin/ProductManager.js - VERSIÓN COMPLETA CON MARCAS Y ESPECIFICACIONES DINÁMICAS

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { categoryService } from '../../services/categoryService';
import { createBrand, getAllBrands } from '../../services/brandService';
import { createSpecificationType, getAllSpecificationTypes } from '../../services/specificationTypeService';
import { getSpecificationTemplate, getVariantTypes } from '../../data/specificationTemplates';
import AddBrandModal from './AddBrandModal';
import AddSpecificationModal from './AddSpecificationModal';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Tag,
  Star,
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  PlusCircle,
  MinusCircle,
  Info
} from 'lucide-react';

let isCreatingProduct = false;

const INITIAL_FORM_DATA = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  categoryId: null,
  categoryName: '',
  subcategory: '',
  subcategoryId: null,
  subcategoryName: '',
  brand: '',
  model: '',
  stock: '',
  stockQuantity: '',
  image: '',
  images: [''],
  isActive: true,
  isFeatured: false,
  isNew: false,
  inStock: true,
  discount: 0,
  rating: 4.5,
  reviews: 0,
  totalReviews: 0,
  tags: [],
  warranty: '12 meses de garantía',
  shipping: 'Envío gratis en 24-48 horas',
  specifications: [],
  features: [],
  variants: []
};

// Modal completo
const CompleteProductModal = React.memo(({ 
  showModal, 
  modalMode, 
  selectedProduct, 
  formData, 
  formErrors,
  newSpecification,
  newFeature,
  newVariant,
  selectedVariantType,
  newTag,
  categories,
  subcategories,
  brands,
  specificationTypes,
  isSaving,
  onClose, 
  onSave, 
  onInputChange,
  onCategoryChange,
  onSubcategoryChange,
  getCategoryDisplayName,
  formatCurrency,
  onSpecificationChange,
  onAddSpecification,
  onRemoveSpecification,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onVariantChange,
  onVariantTypeChange,
  onAddVariant,
  onRemoveVariant,
  onTagChange,
  onAddTag,
  onRemoveTag,
  onUpdateImageField,
  onAddImageField,
  onRemoveImageField,
  onOpenAddBrandModal,
  onOpenAddSpecModal
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-screen overflow-y-auto">
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
          {modalMode === 'view' ? (
            // Vista de solo lectura
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct?.image}
                    alt={selectedProduct?.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedProduct?.name}</h4>
                    <p className="text-gray-600">{selectedProduct?.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Precio</span>
                      <p className="font-semibold text-lg">{formatCurrency(selectedProduct?.price)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Stock</span>
                      <p className="font-semibold">{selectedProduct?.stockQuantity || selectedProduct?.stock || 0} unidades</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Formulario completo
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {/* Información Básica */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
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
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: A2848"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
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

              {/* Precios y Stock */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Precios y Stock</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={onInputChange}
                      step="1"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="200000"
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Precio en pesos (sin centavos)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Original
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1800000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Base *
                    </label>
                    <input
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={onInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Categoría, Subcategoría y Marca */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Categorización</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría Principal *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={onCategoryChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {Object.values(categories).map(category => (
                        <option key={category.slug} value={category.slug}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategoría *
                    </label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={onSubcategoryChange}
                      disabled={!formData.category || subcategories.length === 0}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.subcategory ? 'border-red-500' : 'border-gray-300'
                      } ${!formData.category ? 'bg-gray-100' : ''}`}
                    >
                      <option value="">
                        {!formData.category 
                          ? 'Primero selecciona una categoría' 
                          : subcategories.length === 0
                          ? 'Esta categoría no tiene subcategorías'
                          : 'Seleccionar subcategoría'
                        }
                      </option>
                      {subcategories.map(subcategory => (
                        <option key={subcategory.slug} value={subcategory.slug}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.subcategory && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.subcategory}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca *
                    </label>
                    <div className="flex space-x-2">
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={onInputChange}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.brand ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Seleccionar marca</option>
                        {brands.map(brand => (
                          <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={onOpenAddBrandModal}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap"
                        title="Agregar nueva marca"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Nueva
                      </button>
                    </div>
                    {formErrors.brand && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Imágenes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Imágenes</h4>
                <div className="space-y-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="url"
                        value={image}
                        onChange={(e) => onUpdateImageField(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`URL de imagen ${index + 1}`}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveImageField(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={onAddImageField}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Agregar imagen</span>
                  </button>
                </div>
              </div>

              {/* Especificaciones */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Especificaciones Técnicas</h4>
                
                {formData.specifications.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Especificaciones agregadas:</h5>
                    <div className="space-y-2">
                      {formData.specifications.map((spec, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                          <div>
                            <span className="font-medium text-sm">{spec.label}: </span>
                            <span className="text-sm text-gray-600">{spec.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveSpecification(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="flex space-x-2">
                    <select
                      value={newSpecification.type}
                      onChange={(e) => onSpecificationChange('type', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tipo de especificación</option>
                      {specificationTypes
                        .filter(st => !formData.category || !st.category || st.category === formData.category)
                        .map(type => (
                          <option key={type.id} value={type.type}>{type.label}</option>
                        ))
                      }
                    </select>
                    <button
                      type="button"
                      onClick={onOpenAddSpecModal}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center whitespace-nowrap"
                      title="Agregar nuevo tipo"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    value={newSpecification.label}
                    onChange={(e) => onSpecificationChange('label', e.target.value)}
                    placeholder="Etiqueta"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <input
                    type="text"
                    value={newSpecification.value}
                    onChange={(e) => onSpecificationChange('value', e.target.value)}
                    placeholder="Valor"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <button
                    type="button"
                    onClick={onAddSpecification}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Características */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Características Principales</h4>
                
                {formData.features.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Características agregadas:</h5>
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => onRemoveFeature(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => onFeatureChange(e.target.value)}
                    placeholder="Ej: Pantalla OLED de alta resolución"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={onAddFeature}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Variantes con Stock Individual */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Variantes con Stock Individual</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Define las variantes disponibles (tallas, colores, etc.) con stock individual para cada una.
                </p>
                
                {/* Selector de tipo de variante */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Variante
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getVariantTypes(formData.category).map((variantType) => (
                      <button
                        key={variantType.type}
                        type="button"
                        onClick={() => onVariantTypeChange(variantType.type)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedVariantType === variantType.type
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        {variantType.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Variantes agregadas */}
                {formData.variants.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-3">Variantes agregadas:</h5>
                    <div className="space-y-2">
                      {formData.variants.map((variant, index) => (
                        <div key={variant.id || index} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-4 flex-1">
                            {variant.type === 'color' ? (
                              <div
                                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: variant.value }}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-gray-50 flex-shrink-0">
                                <span className="text-xs font-bold text-gray-600">
                                  {variant.value?.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{variant.name}</span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                  {variant.type === 'color' ? 'Color' : 
                                   variant.type === 'size' ? 'Talla' : 
                                   variant.type}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>Stock: <strong>{variant.stock}</strong></span>
                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                  variant.available && variant.stock > 0
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {variant.available && variant.stock > 0 ? 'Disponible' : 'No disponible'}
                                </span>
                                {variant.sku && (
                                  <span className="text-xs text-gray-500">SKU: {variant.sku}</span>
                                )}
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => onRemoveVariant(index)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <MinusCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-800 font-medium">Stock total en variantes:</span>
                        <span className="text-blue-900 font-bold text-lg">
                          {formData.variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0)} unidades
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Formulario para agregar nueva variante */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
                  <h5 className="font-medium mb-3 text-gray-700">
                    Agregar nueva {selectedVariantType === 'color' ? 'color' : selectedVariantType === 'size' ? 'talla' : 'variante'}
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={newVariant.name}
                        onChange={(e) => onVariantChange('name', e.target.value)}
                        placeholder={
                          selectedVariantType === 'color' ? 'Ej: Negro' :
                          selectedVariantType === 'size' ? 'Ej: M, 38' :
                          'Ej: 256GB'
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {selectedVariantType === 'color' ? 'Color' : 'Valor'} *
                      </label>
                      {selectedVariantType === 'color' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={newVariant.value}
                            onChange={(e) => onVariantChange('value', e.target.value)}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={newVariant.value}
                            onChange={(e) => onVariantChange('value', e.target.value)}
                            placeholder="#000000"
                            className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-xs"
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={newVariant.value}
                          onChange={(e) => onVariantChange('value', e.target.value)}
                          placeholder={
                            selectedVariantType === 'size' ? 'M, 38, L' :
                            '256GB, 8GB'
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={newVariant.stock}
                        onChange={(e) => onVariantChange('stock', parseInt(e.target.value) || 0)}
                        min="0"
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        SKU (opcional)
                      </label>
                      <input
                        type="text"
                        value={newVariant.sku}
                        onChange={(e) => onVariantChange('sku', e.target.value)}
                        placeholder="Auto"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={onAddVariant}
                        disabled={!newVariant.name.trim() || !newVariant.value}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Agregar
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newVariant.available}
                        onChange={(e) => onVariantChange('available', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">Marcar como disponible</span>
                    </label>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">Consejos:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Define el stock individual para cada variante</li>
                        <li>El SKU se genera automáticamente si lo dejas vacío</li>
                        <li>Una variante sin stock o marcada como no disponible no se podrá comprar</li>
                        <li>Para productos de moda/calzado, usa el tipo "Talla" para tallas</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Tags</h4>
                
                {formData.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {tag}
                          <button
                            type="button"
                            onClick={() => onRemoveTag(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => onTagChange(e.target.value)}
                    placeholder="Ej: premium, wireless, gaming"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
                  />
                  <button
                    type="button"
                    onClick={onAddTag}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Información Adicional</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garantía
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="12 meses de garantía"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Información de Envío
                    </label>
                    <input
                      type="text"
                      name="shipping"
                      value={formData.shipping}
                      onChange={onInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Envío gratis en 24-48 horas"
                    />
                  </div>
                </div>
              </div>

              {/* Estados del Producto */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Estados del Producto</h4>
                <div className="flex flex-wrap gap-6">
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={onInputChange}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Producto activo</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={onInputChange}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Producto destacado</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={formData.isNew}
                      onChange={onInputChange}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Producto nuevo</span>
                  </label>
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
            {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
          </button>
          {modalMode !== 'view' && (
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Producto
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

const ProductManager = () => {
  const { 
    products: allProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct
  } = useProducts();

  const products = allProducts;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Estados para categorías
  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Estados para marcas
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);

  // Estados para tipos de especificaciones
  const [specificationTypes, setSpecificationTypes] = useState([]);
  const [loadingSpecTypes, setLoadingSpecTypes] = useState(true);
  const [showAddSpecModal, setShowAddSpecModal] = useState(false);

  // Estados para formularios dinámicos
  const [newSpecification, setNewSpecification] = useState({ type: '', label: '', value: '' });
  const [newFeature, setNewFeature] = useState('');
  const [selectedVariantType, setSelectedVariantType] = useState('color');
  const [newVariant, setNewVariant] = useState({ 
    type: 'color',
    name: '', 
    value: '#000000',
    stock: 0,
    sku: '',
    available: true 
  });
  const [newTag, setNewTag] = useState('');

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);

  // Cargar marcas
  useEffect(() => {
    const loadBrands = async () => {
      setLoadingBrands(true);
      try {
        const data = await getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setLoadingBrands(false);
      }
    };
    
    loadBrands();
  }, []);

  // Cargar tipos de especificaciones
  useEffect(() => {
    const loadSpecTypes = async () => {
      setLoadingSpecTypes(true);
      try {
        const data = await getAllSpecificationTypes();
        setSpecificationTypes(data);
      } catch (error) {
        console.error('Error loading specification types:', error);
      } finally {
        setLoadingSpecTypes(false);
      }
    };
    
    loadSpecTypes();
  }, []);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  const getCategoryDisplayName = useCallback((category) => {
    const categoryMap = {
      'tecnologia': 'Tecnología',
      'hogar': 'Hogar y Jardín',
      'deportes': 'Deportes y Fitness',
      'salud': 'Salud y Belleza',
      'moda': 'Moda y Ropa',
      'libros': 'Libros y Media'
    };
    return categoryMap[category] || category;
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || 
                             product.category === selectedCategory || 
                             product.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, searchTerm, selectedCategory, selectedBrand]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return (a.stockQuantity || a.stock || 0) - (b.stockQuantity || b.stock || 0);
        case 'created':
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const handleAddProduct = useCallback(() => {
    setModalMode('add');
    setFormData({ ...INITIAL_FORM_DATA });
    setFormErrors({});
    setSubcategories([]);
    setNewSpecification({ type: '', label: '', value: '' });
    setNewFeature('');
    setSelectedVariantType('color');
    setNewVariant({ 
      type: 'color',
      name: '', 
      value: '#000000',
      stock: 0,
      sku: '',
      available: true 
    });
    setNewTag('');
    setShowModal(true);
  }, []);

  const handleEditProduct = useCallback((product) => {
    if (!product.isFromAdmin) {
      alert('Solo puedes editar productos que hayas creado en el panel administrativo.');
      return;
    }
    
    setModalMode('edit');
    setSelectedProduct(product);
    
    const categorySlug = product.category;
    if (categorySlug && categories[categorySlug]?.subcategories) {
      setSubcategories(Object.values(categories[categorySlug].subcategories));
    }
    
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category || '',
      categoryId: product.category_id || null,
      categoryName: product.categoryName || '',
      subcategory: product.subcategory || '',
      subcategoryId: product.subcategory_id || null,
      subcategoryName: product.subcategoryName || '',
      brand: product.brand,
      model: product.model || '',
      stock: (product.stock || product.stockQuantity || 0).toString(),
      stockQuantity: (product.stockQuantity || product.stock || 0).toString(),
      image: product.image || '',
      images: product.images || [product.image || ''],
      isActive: product.isActive !== false,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      inStock: product.inStock !== false,
      discount: product.discount || 0,
      rating: product.rating || 4.5,
      reviews: product.reviews || 0,
      totalReviews: product.totalReviews || 0,
      tags: product.tags || [],
      warranty: product.warranty || '12 meses de garantía',
      shipping: product.shipping || 'Envío gratis en 24-48 horas',
      specifications: product.specifications || [],
      features: product.features || [],
      variants: product.variants || []
    });
    setFormErrors({});
    setShowModal(true);
  }, [categories]);

  const handleViewProduct = useCallback((product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setShowModal(true);
  }, []);

  const handleDeleteProduct = useCallback((product) => {
    if (!product.isFromAdmin) {
      alert('Solo puedes eliminar productos que hayas creado en el panel administrativo.');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  }, [deleteProduct]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    if (!formData.price || formData.price <= 0) errors.price = 'El precio debe ser mayor a 0';
    if (!formData.category) errors.category = 'La categoría es requerida';
    if (!formData.subcategory) errors.subcategory = 'La subcategoría es requerida';
    if (!formData.brand) errors.brand = 'La marca es requerida';
    if (!formData.stockQuantity || formData.stockQuantity < 0) errors.stockQuantity = 'El stock debe ser 0 o mayor';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSaveProduct = useCallback(async () => {
    if (!validateForm()) return;
    
    if (isSaving) {
      console.log('Ya se está guardando, ignorando...');
      return;
    }

    setIsSaving(true);
    isCreatingProduct = true;
    
    try {
      const price = parseFloat(formData.price);
      const originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : null;
      const discount = originalPrice && originalPrice > price ? 
        Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

      const productData = {
        name: formData.name,
        description: formData.description,
        price: price,
        originalPrice: originalPrice,
        category_id: formData.categoryId,
        subcategory_id: formData.subcategoryId,
        category: formData.category,
        categoryName: formData.categoryName,
        subcategory: formData.subcategory,
        subcategoryName: formData.subcategoryName,
        brand: formData.brand,
        model: formData.model,
        stock: parseInt(formData.stockQuantity),
        stockQuantity: parseInt(formData.stockQuantity),
        image: formData.images[0] || formData.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&q=80',
        images: formData.images.filter(img => img.trim() !== ''),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        inStock: formData.inStock && parseInt(formData.stockQuantity) > 0,
        discount: discount,
        rating: parseFloat(formData.rating),
        reviews: parseInt(formData.reviews) || 0,
        totalReviews: parseInt(formData.totalReviews) || 0,
        tags: formData.tags || [],
        warranty: formData.warranty,
        shipping: formData.shipping,
        specifications: formData.specifications || [],
        features: formData.features || [],
        variants: formData.variants || []
      };

      if (modalMode === 'add') {
        await addProduct(productData);
      } else if (modalMode === 'edit') {
        await updateProduct(selectedProduct.id, productData);
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el producto');
    } finally {
      setIsSaving(false);
      isCreatingProduct = false;
    }
  }, [formData, modalMode, selectedProduct, validateForm, addProduct, updateProduct, isSaving]);
  
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (name === 'stockQuantity') {
        newData.stock = value;
        newData.inStock = parseInt(value) > 0;
      }

      return newData;
    });

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  const handleCategoryChange = useCallback((e) => {
    const categorySlug = e.target.value;
    const selectedCategory = Object.values(categories).find(c => c.slug === categorySlug);
    
    setFormData(prev => ({
      ...prev,
      category: categorySlug,
      categoryId: selectedCategory?.dbId || null,
      categoryName: selectedCategory?.name || '',
      subcategory: '',
      subcategoryId: null,
      subcategoryName: ''
    }));
    
    if (selectedCategory?.subcategories) {
      setSubcategories(Object.values(selectedCategory.subcategories));
    } else {
      setSubcategories([]);
    }
    
    const variantTypes = getVariantTypes(categorySlug);
    if (variantTypes.length > 0) {
      setSelectedVariantType(variantTypes[0].type);
      setNewVariant({
        type: variantTypes[0].type,
        name: '',
        value: variantTypes[0].type === 'color' ? '#000000' : '',
        stock: 0,
        sku: '',
        available: true
      });
    }
    
    if (formErrors.category) {
      setFormErrors(prev => ({ ...prev, category: '' }));
    }
  }, [categories, formErrors]);

  const handleSubcategoryChange = useCallback((e) => {
    const subcategorySlug = e.target.value;
    const selectedSubcategory = subcategories.find(s => s.slug === subcategorySlug);
    
    setFormData(prev => ({
      ...prev,
      subcategory: subcategorySlug,
      subcategoryId: selectedSubcategory?.dbId || null,
      subcategoryName: selectedSubcategory?.name || ''
    }));
    
    if (formErrors.subcategory) {
      setFormErrors(prev => ({ ...prev, subcategory: '' }));
    }
  }, [subcategories, formErrors]);

  const handleSpecificationChange = useCallback((field, value) => {
    setNewSpecification(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'type') {
        const selectedType = specificationTypes.find(t => t.type === value);
        updated.label = selectedType ? selectedType.label : '';
      }
      return updated;
    });
  }, [specificationTypes]);

  const handleAddSpecification = useCallback(() => {
    if (newSpecification.type && newSpecification.label && newSpecification.value) {
      const selectedType = specificationTypes.find(t => t.type === newSpecification.type);
      const spec = {
        type: newSpecification.type,
        label: selectedType ? selectedType.label : newSpecification.label,
        value: newSpecification.value
      };
      
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, spec]
      }));
      
      setNewSpecification({ type: '', label: '', value: '' });
    }
  }, [newSpecification, specificationTypes]);

  const handleRemoveSpecification = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  }, []);

  const handleFeatureChange = useCallback((value) => {
    setNewFeature(value);
  }, []);

  const handleAddFeature = useCallback(() => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  }, [newFeature]);

  const handleRemoveFeature = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  }, []);

  const handleVariantTypeChange = useCallback((type) => {
    setSelectedVariantType(type);
    setNewVariant({
      type: type,
      name: '',
      value: type === 'color' ? '#000000' : '',
      stock: 0,
      sku: '',
      available: true
    });
  }, []);

  const handleVariantChange = useCallback((field, value) => {
    setNewVariant(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddVariant = useCallback(() => {
    if (newVariant.name.trim() && (newVariant.stock >= 0)) {
      const variant = {
        ...newVariant,
        id: `var-${Date.now()}`,
        sku: newVariant.sku || `${formData.name?.substring(0, 3).toUpperCase() || 'PROD'}-${newVariant.value}-${Date.now()}`
      };
      
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, variant]
      }));
      
      setNewVariant({
        type: selectedVariantType,
        name: '',
        value: selectedVariantType === 'color' ? '#000000' : '',
        stock: 0,
        sku: '',
        available: true
      });
    }
  }, [newVariant, selectedVariantType, formData.name]);

  const handleRemoveVariant = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  }, []);

  const handleTagChange = useCallback((value) => {
    setNewTag(value);
  }, []);

  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  }, [newTag, formData.tags]);

  const handleRemoveTag = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  }, []);

  const handleUpdateImageField = useCallback((index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  }, []);

  const handleAddImageField = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  }, []);

  const handleRemoveImageField = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }, []);

  // Handlers para agregar nueva marca y especificación
  const handleAddNewBrand = useCallback(async (brandData) => {
    try {
      const newBrand = await createBrand(brandData);
      setBrands(prev => [...prev, newBrand].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ ...prev, brand: newBrand.name }));
    } catch (error) {
      console.error('Error adding brand:', error);
      throw error;
    }
  }, []);

  const handleAddNewSpecType = useCallback(async (specData) => {
    try {
      const newSpecType = await createSpecificationType(specData);
      setSpecificationTypes(prev => [...prev, newSpecType].sort((a, b) => a.label.localeCompare(b.label)));
      setNewSpecification({
        type: newSpecType.type,
        label: newSpecType.label,
        value: ''
      });
    } catch (error) {
      console.error('Error adding specification type:', error);
      throw error;
    }
  }, []);

  const getStockStatus = useCallback((product) => {
    const stock = product.stockQuantity || product.stock || 0;
    if (stock === 0) return { label: 'Sin Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { label: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En Stock', color: 'bg-green-100 text-green-800' };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">Administra tu inventario y catálogo</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar productos..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              {Object.values(categories).map(category => (
                <option key={category.slug} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las marcas</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.name}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
              <option value="created">Fecha creación</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Productos ({sortedProducts.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                          {product.categoryName || product.category}
                        </span>
                        {product.subcategoryName && (
                          <div className="mt-1">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                              {product.subcategoryName}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                      {product.discount > 0 && (
                        <div className="text-xs text-red-600">-{product.discount}%</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                        {product.stockQuantity || product.stock || 0} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {product.isActive !== false && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Activo
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Destacado
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Nuevo
                          </span>
                        )}
                        {product.isFromAdmin && (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className={`${product.isFromAdmin ? 'text-indigo-600 hover:text-indigo-900' : 'text-gray-400 cursor-not-allowed'}`}
                          disabled={!product.isFromAdmin}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className={`${product.isFromAdmin ? 'text-red-600 hover:text-red-900' : 'text-gray-400 cursor-not-allowed'}`}
                          disabled={!product.isFromAdmin}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Producto */}
      <CompleteProductModal
        showModal={showModal}
        modalMode={modalMode}
        selectedProduct={selectedProduct}
        formData={formData}
        formErrors={formErrors}
        newSpecification={newSpecification}
        newFeature={newFeature}
        newVariant={newVariant}
        selectedVariantType={selectedVariantType}
        newTag={newTag}
        categories={categories}
        subcategories={subcategories}
        brands={brands}
        specificationTypes={specificationTypes}
        isSaving={isSaving}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProduct}
        onInputChange={handleInputChange}
        onCategoryChange={handleCategoryChange}
        onSubcategoryChange={handleSubcategoryChange}
        getCategoryDisplayName={getCategoryDisplayName}
        formatCurrency={formatCurrency}
        onSpecificationChange={handleSpecificationChange}
        onAddSpecification={handleAddSpecification}
        onRemoveSpecification={handleRemoveSpecification}
        onFeatureChange={handleFeatureChange}
        onAddFeature={handleAddFeature}
        onRemoveFeature={handleRemoveFeature}
        onVariantChange={handleVariantChange}
        onVariantTypeChange={handleVariantTypeChange}
        onAddVariant={handleAddVariant}
        onRemoveVariant={handleRemoveVariant}
        onTagChange={handleTagChange}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onUpdateImageField={handleUpdateImageField}
        onAddImageField={handleAddImageField}
        onRemoveImageField={handleRemoveImageField}
        onOpenAddBrandModal={() => setShowAddBrandModal(true)}
        onOpenAddSpecModal={() => setShowAddSpecModal(true)}
      />

      {/* Modales para agregar marcas y especificaciones */}
      <AddBrandModal
        isOpen={showAddBrandModal}
        onClose={() => setShowAddBrandModal(false)}
        onSave={handleAddNewBrand}
      />

      <AddSpecificationModal
        isOpen={showAddSpecModal}
        onClose={() => setShowAddSpecModal(false)}
        onSave={handleAddNewSpecType}
        currentCategory={formData.category}
      />
    </div>
  );
};

export default ProductManager;
