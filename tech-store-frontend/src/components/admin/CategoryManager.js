// src/components/admin/CategoryManager.js - Conectado a Supabase
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
  Search,
  List,
  Grid,
  AlertCircle,
  CheckCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { categoryService } from '../../services/categoryService';

const CategoryManager = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    id: '',
    dbId: null,
    name: '',
    slug: '',
    icon: '',
    description: ''
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    id: '',
    dbId: null,
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
      
      // Expandir todas por defecto
      const allExpanded = {};
      Object.keys(data).forEach(categoryId => {
        allExpanded[categoryId] = true;
      });
      setExpandedCategories(allExpanded);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        dbId: category.dbId,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description
      });
      setEditingCategory(category.dbId);
    } else {
      setCategoryForm({
        id: '',
        dbId: null,
        name: '',
        slug: '',
        icon: '📦',
        description: ''
      });
      setEditingCategory(null);
    }
    setShowModal(true);
  };

  const openSubcategoryModal = (category, subcategory = null) => {
    setModalType('subcategory');
    setSelectedCategory(category);
    if (subcategory) {
      setSubcategoryForm({
        id: subcategory.id,
        dbId: subcategory.dbId,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description
      });
      setEditingSubcategory(subcategory.dbId);
    } else {
      setSubcategoryForm({
        id: '',
        dbId: null,
        name: '',
        slug: '',
        description: ''
      });
      setEditingSubcategory(null);
    }
    setShowModal(true);
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim()) {
      showNotification('El nombre de la categoría es requerido', 'error');
      return;
    }

    setSaving(true);
    try {
      const slug = categoryForm.slug || categoryForm.name.toLowerCase()
        .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
        .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
        .replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

      const categoryData = {
        name: categoryForm.name,
        slug: slug,
        icon: categoryForm.icon || '📦',
        description: categoryForm.description
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory, categoryData);
        showNotification('Categoría actualizada');
      } else {
        await categoryService.createCategory(categoryData);
        showNotification('Categoría creada');
      }

      await loadCategories();
      setShowModal(false);
      setEditingCategory(null);
      setCategoryForm({ id: '', dbId: null, name: '', slug: '', icon: '', description: '' });
    } catch (err) {
      showNotification(err.message || 'Error al guardar la categoría', 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const saveSubcategory = async () => {
    if (!subcategoryForm.name.trim()) {
      showNotification('El nombre de la subcategoría es requerido', 'error');
      return;
    }

    setSaving(true);
    try {
      const slug = subcategoryForm.slug || subcategoryForm.name.toLowerCase()
        .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
        .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
        .replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

      const subcategoryData = {
        name: subcategoryForm.name,
        slug: slug,
        description: subcategoryForm.description
      };

      if (editingSubcategory) {
        await categoryService.updateCategory(editingSubcategory, subcategoryData);
        showNotification('Subcategoría actualizada');
      } else {
        await categoryService.createSubcategory(selectedCategory.dbId, subcategoryData);
        showNotification('Subcategoría creada');
      }

      await loadCategories();
      setShowModal(false);
      setEditingSubcategory(null);
      setSubcategoryForm({ id: '', dbId: null, name: '', slug: '', description: '' });
    } catch (err) {
      showNotification(err.message || 'Error al guardar la subcategoría', 'error');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (category) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${category.name}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(category.dbId);
      showNotification('Categoría eliminada');
      await loadCategories();
    } catch (err) {
      showNotification(err.message || 'Error al eliminar la categoría', 'error');
      console.error(err);
    }
  };

  const deleteSubcategory = async (subcategory) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${subcategory.name}"?`)) {
      return;
    }

    try {
      await categoryService.deleteCategory(subcategory.dbId);
      showNotification('Subcategoría eliminada');
      await loadCategories();
    } catch (err) {
      showNotification(err.message || 'Error al eliminar la subcategoría', 'error');
      console.error(err);
    }
  };

  const duplicateCategory = async (category) => {
    try {
      await categoryService.duplicateCategory(category.dbId);
      showNotification('Categoría duplicada');
      await loadCategories();
    } catch (err) {
      showNotification('Error al duplicar la categoría', 'error');
      console.error(err);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
          <div className="flex gap-2">
            <button
              onClick={loadCategories}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Actualizar
            </button>
            <button
              onClick={() => openCategoryModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nueva Categoría
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

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
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Tag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No hay categorías que mostrar</p>
          <button
            onClick={() => openCategoryModal()}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Crear primera categoría
          </button>
        </div>
      ) : (
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
                      onClick={() => openSubcategoryModal(category)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="Agregar subcategoría"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => duplicateCategory(category)}
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
                      onClick={() => deleteCategory(category)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Eliminar categoría"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              {expandedCategories[category.id] && category.subcategories && Object.keys(category.subcategories).length > 0 && (
                <div className="p-6 bg-gray-50">
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    {Object.values(category.subcategories).map(subcategory => (
                      <div
                        key={subcategory.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => openSubcategoryModal(category, subcategory)}
                              className="text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"
                              title="Editar subcategoría"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSubcategory(subcategory)}
                              className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors"
                              title="Eliminar subcategoría"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Se genera automáticamente si se deja vacío"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icono (Emoji)</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={subcategoryForm.slug}
                      onChange={(e) => setSubcategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Se genera automáticamente si se deja vacío"
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
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={modalType === 'category' ? saveCategory : saveSubcategory}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : ((modalType === 'category' ? editingCategory : editingSubcategory) ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
