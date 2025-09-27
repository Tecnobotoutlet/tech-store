// src/components/admin/CategoryManager.js - Gestor Completo de Categorías
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Save, 
  X, 
  ChevronDown, 
  ChevronRight,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreVertical,
  List,
  Grid,
  AlertCircle,
  CheckCircle,
  Copy
} from 'lucide-react';
import { categories as initialCategories } from '../../data/categories';

const CategoryManager = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('category'); // 'category' | 'subcategory'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [notification, setNotification] = useState(null);

  // Estados para formularios
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    icon: '',
    description: ''
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    id: '',
    name: '',
    description: '',
    brands: [],
    filters: []
  });

  useEffect(() => {
    // Expandir todas las categorías por defecto
    const allExpanded = {};
    Object.keys(categories).forEach(categoryId => {
      allExpanded[categoryId] = true;
    });
    setExpandedCategories(allExpanded);
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const openCategoryModal = (category = null) => {
    setModalType('category');
    if (category) {
      setCategoryForm({
        id: category.id,
        name: category.name,
        icon: category.icon,
        description: category.description
      });
      setEditingCategory(category.id);
    } else {
      setCategoryForm({
        id: '',
        name: '',
        icon: '',
        description: ''
      });
      setEditingCategory(null);
    }
    setShowModal(true);
  };

  const openSubcategoryModal = (categoryId, subcategory = null) => {
    setModalType('subcategory');
    setSelectedCategory(categoryId);
    if (subcategory) {
      setSubcategoryForm({
        id: subcategory.id,
        name: subcategory.name,
        description: subcategory.description,
        brands: subcategory.brands || [],
        filters: subcategory.filters || []
      });
      setEditingSubcategory(subcategory.id);
    } else {
      setSubcategoryForm({
        id: '',
        name: '',
        description: '',
        brands: [],
        filters: []
      });
      setEditingSubcategory(null);
    }
    setShowModal(true);
  };

  const saveCategory = () => {
    if (!categoryForm.name.trim()) {
      showNotification('El nombre de la categoría es requerido', 'error');
      return;
    }

    const categoryId = categoryForm.id || categoryForm.name.toLowerCase().replace(/\s+/g, '_');
    
    // Verificar si el ID ya existe (solo para nuevas categorías)
    if (!editingCategory && categories[categoryId]) {
      showNotification('Ya existe una categoría con ese nombre', 'error');
      return;
    }

    const newCategory = {
      id: categoryId,
      name: categoryForm.name,
      icon: categoryForm.icon || '📦',
      description: categoryForm.description,
      subcategories: editingCategory ? categories[editingCategory].subcategories : {}
    };

    setCategories(prev => {
      const updated = { ...prev };
      if (editingCategory && editingCategory !== categoryId) {
        // Si cambió el ID, eliminar la categoría anterior
        delete updated[editingCategory];
      }
      updated[categoryId] = newCategory;
      return updated;
    });

    setShowModal(false);
    setEditingCategory(null);
    setCategoryForm({ id: '', name: '', icon: '', description: '' });
    showNotification(editingCategory ? 'Categoría actualizada' : 'Categoría creada');
  };

  const saveSubcategory = () => {
    if (!subcategoryForm.name.trim()) {
      showNotification('El nombre de la subcategoría es requerido', 'error');
      return;
    }

    const subcategoryId = subcategoryForm.id || subcategoryForm.name.toLowerCase().replace(/\s+/g, '_');
    
    const newSubcategory = {
      id: subcategoryId,
      name: subcategoryForm.name,
      description: subcategoryForm.description,
      brands: subcategoryForm.brands,
      filters: subcategoryForm.filters
    };

    setCategories(prev => ({
      ...prev,
      [selectedCategory]: {
        ...prev[selectedCategory],
        subcategories: {
          ...prev[selectedCategory].subcategories,
          [subcategoryId]: newSubcategory
        }
      }
    }));

    setShowModal(false);
    setEditingSubcategory(null);
    setSubcategoryForm({ id: '', name: '', description: '', brands: [], filters: [] });
    showNotification(editingSubcategory ? 'Subcategoría actualizada' : 'Subcategoría creada');
  };

  const deleteCategory = (categoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría y todas sus subcategorías?')) {
      setCategories(prev => {
        const updated = { ...prev };
        delete updated[categoryId];
        return updated;
      });
      showNotification('Categoría eliminada');
    }
  };

  const deleteSubcategory = (categoryId, subcategoryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      setCategories(prev => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          subcategories: Object.fromEntries(
            Object.entries(prev[categoryId].subcategories).filter(([id]) => id !== subcategoryId)
          )
        }
      }));
      showNotification('Subcategoría eliminada');
    }
  };

  const duplicateCategory = (categoryId) => {
    const category = categories[categoryId];
    const newId = `${categoryId}_copy`;
    const newCategory = {
      ...category,
      id: newId,
      name: `${category.name} (Copia)`
    };
    
    setCategories(prev => ({
      ...prev,
      [newId]: newCategory
    }));
    showNotification('Categoría duplicada');
  };

  const addBrand = () => {
    setSubcategoryForm(prev => ({
      ...prev,
      brands: [...prev.brands, '']
    }));
  };

  const updateBrand = (index, value) => {
    setSubcategoryForm(prev => ({
      ...prev,
      brands: prev.brands.map((brand, i) => i === index ? value : brand)
    }));
  };

  const removeBrand = (index) => {
    setSubcategoryForm(prev => ({
      ...prev,
      brands: prev.brands.filter((_, i) => i !== index)
    }));
  };

  const addFilter = () => {
    setSubcategoryForm(prev => ({
      ...prev,
      filters: [...prev.filters, '']
    }));
  };

  const updateFilter = (index, value) => {
    setSubcategoryForm(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => i === index ? value : filter)
    }));
  };

  const removeFilter = (index) => {
    setSubcategoryForm(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const filteredCategories = Object.values(categories).filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryStats = () => {
    const totalCategories = Object.keys(categories).length;
    const totalSubcategories = Object.values(categories).reduce(
      (sum, category) => sum + (category.subcategories ? Object.keys(category.subcategories).length : 0), 0
    );
    return { totalCategories, totalSubcategories };
  };

  const stats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Categorías</h2>
            <p className="text-gray-600">Administra las categorías y subcategorías de tu tienda</p>
          </div>
          <button
            onClick={() => openCategoryModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Categoría
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Categorías</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <List className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Subcategorías</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSubcategories}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Grid className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Promedio Sub/Cat</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCategories > 0 ? Math.round(stats.totalSubcategories / stats.totalCategories) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {filteredCategories.map(category => (
          <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Category Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {expandedCategories[category.id] ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.subcategories ? Object.keys(category.subcategories).length : 0} subcategorías
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSubcategoryModal(category.id)}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    title="Agregar subcategoría"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => duplicateCategory(category.id)}
                    className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"
                    title="Duplicar categoría"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openCategoryModal(category)}
                    className="text-gray-600 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    title="Editar categoría"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Eliminar categoría"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {expandedCategories[category.id] && category.subcategories && (
              <div className="p-6 bg-gray-50">
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                  {Object.values(category.subcategories).map(subcategory => (
                    <div
                      key={subcategory.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => openSubcategoryModal(category.id, subcategory)}
                            className="text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"
                            title="Editar subcategoría"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSubcategory(category.id, subcategory.id)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
                            title="Eliminar subcategoría"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {subcategory.brands && subcategory.brands.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Marcas:</p>
                          <div className="flex flex-wrap gap-1">
                            {subcategory.brands.slice(0, 3).map((brand, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {brand}
                              </span>
                            ))}
                            {subcategory.brands.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{subcategory.brands.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {subcategory.filters && subcategory.filters.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Filtros:</p>
                          <div className="flex flex-wrap gap-1">
                            {subcategory.filters.slice(0, 3).map((filter, index) => (
                              <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                {filter}
                              </span>
                            ))}
                            {subcategory.filters.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                +{subcategory.filters.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalType === 'category' 
                    ? (editingCategory ? 'Editar Categoría' : 'Nueva Categoría')
                    : (editingSubcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría')
                  }
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {modalType === 'category' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Tecnología"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="📱"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción de la categoría..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      type="text"
                      value={subcategoryForm.name}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Smartphones"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      value={subcategoryForm.description}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descripción de la subcategoría..."
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Marcas</label>
                      <button
                        type="button"
                        onClick={addBrand}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                    <div className="space-y-2">
                      {subcategoryForm.brands.map((brand, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={brand}
                            onChange={(e) => updateBrand(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nombre de la marca"
                          />
                          <button
                            type="button"
                            onClick={() => removeBrand(index)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Filtros</label>
                      <button
                        type="button"
                        onClick={addFilter}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </button>
                    </div>
                    <div className="space-y-2">
                      {subcategoryForm.filters.map((filter, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={filter}
                            onChange={(e) => updateFilter(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Marca, Talla, Color"
                          />
                          <button
                            type="button"
                            onClick={() => removeFilter(index)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={modalType === 'category' ? saveCategory : saveSubcategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {(modalType === 'category' ? editingCategory : editingSubcategory) ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;