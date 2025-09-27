// src/components/admin/ProductManager.js
import React, { useState, useEffect } from 'react';
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
  Download
} from 'lucide-react';

const ProductManager = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      description: 'El iPhone más avanzado con chip A17 Pro y cámara de 48MP',
      price: 4500000,
      category: 'Smartphones',
      brand: 'Apple',
      stock: 15,
      image: '/api/placeholder/300/300',
      isActive: true,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      description: 'Laptop ultradelgada con chip M2 y pantalla Liquid Retina',
      price: 3200000,
      category: 'Laptops',
      brand: 'Apple',
      stock: 8,
      image: '/api/placeholder/300/300',
      isActive: true,
      isFeatured: false,
      isNew: true,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Smartphone premium con S Pen y cámara de 200MP',
      price: 4200000,
      category: 'Smartphones',
      brand: 'Samsung',
      stock: 2,
      image: '/api/placeholder/300/300',
      isActive: true,
      isFeatured: true,
      isNew: false,
      createdAt: '2024-01-08'
    }
  ]);

  const [categories] = useState([
    'Smartphones',
    'Laptops',
    'Tablets',
    'Audio',
    'Gaming',
    'Accesorios',
    'Smartwatch'
  ]);

  const [brands] = useState([
    'Apple',
    'Samsung',
    'Google',
    'Xiaomi',
    'Sony',
    'HP',
    'Dell',
    'Asus'
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    image: '',
    isActive: true,
    isFeatured: false,
    isNew: false
  });
  const [formErrors, setFormErrors] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'stock':
        return a.stock - b.stock;
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });

  const handleAddProduct = () => {
    setModalMode('add');
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      image: '',
      isActive: true,
      isFeatured: false,
      isNew: false
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      image: product.image,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      isNew: product.isNew
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleViewProduct = (product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    if (!formData.price || formData.price <= 0) errors.price = 'El precio debe ser mayor a 0';
    if (!formData.category) errors.category = 'La categoría es requerida';
    if (!formData.brand) errors.brand = 'La marca es requerida';
    if (!formData.stock || formData.stock < 0) errors.stock = 'El stock debe ser 0 o mayor';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      updatedAt: new Date().toISOString()
    };

    if (modalMode === 'add') {
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id)) + 1,
        createdAt: new Date().toISOString()
      };
      setProducts([...products, newProduct]);
    } else if (modalMode === 'edit') {
      setProducts(products.map(p => 
        p.id === selectedProduct.id ? { ...p, ...productData } : p
      ));
    }

    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Sin Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { label: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En Stock', color: 'bg-green-100 text-green-800' };
  };

  const ProductModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">
            {modalMode === 'add' ? 'Agregar Producto' : 
             modalMode === 'edit' ? 'Editar Producto' : 'Ver Producto'}
          </h3>
          <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
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
                      <p className="font-semibold">{selectedProduct?.stock} unidades</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Categoría</span>
                      <p className="font-medium">{selectedProduct?.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Marca</span>
                      <p className="font-medium">{selectedProduct?.brand}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {selectedProduct?.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activo</span>
                    )}
                    {selectedProduct?.isFeatured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Destacado</span>
                    )}
                    {selectedProduct?.isNew && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Nuevo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Formulario de edición/creación
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1500000"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción detallada del producto..."
                />
                {formErrors.description && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleccionar marca</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  {formErrors.brand && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10"
                  />
                  {formErrors.stock && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                  <span className="ml-2 text-sm text-gray-700">Producto activo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                  <span className="ml-2 text-sm text-gray-700">Producto destacado</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  />
                  <span className="ml-2 text-sm text-gray-700">Producto nuevo</span>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
          </button>
          {modalMode !== 'view' && (
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </button>
          )}
        </div>
      </div>
    </div>
  );

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

      {/* Filtros y búsqueda */}
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
                <option key={brand} value={brand}>{brand}</option>
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
                const stockStatus = getStockStatus(product.stock);
                
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
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {product.isActive && (
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
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900"
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

      {/* Modal */}
      {showModal && <ProductModal />}
    </div>
  );
};

export default ProductManager;