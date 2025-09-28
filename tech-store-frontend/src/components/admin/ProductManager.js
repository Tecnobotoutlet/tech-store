// src/components/admin/ProductManager.js - Formulario Completo con Especificaciones
import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
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
  MinusCircle
} from 'lucide-react';

const ProductManager = () => {
  const { 
    products: allProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    getProductStats
  } = useProducts();

  const products = allProducts;

  const [categories] = useState([
    'tecnologia',
    'hogar', 
    'deportes',
    'salud',
    'moda',
    'libros'
  ]);

  const [brands] = useState([
    'Apple',
    'Samsung',
    'Google',
    'Xiaomi',
    'Sony',
    'HP',
    'Dell',
    'Asus',
    'Nike',
    'Adidas',
    'IKEA',
    'Centrum'
  ]);

  // Tipos de especificaciones predefinidos
  const [specificationTypes] = useState([
    { type: "processor", label: "Procesador" },
    { type: "ram", label: "Memoria RAM" },
    { type: "storage", label: "Almacenamiento" },
    { type: "display", label: "Pantalla" },
    { type: "camera", label: "Cámara" },
    { type: "battery", label: "Batería" },
    { type: "os", label: "Sistema Operativo" },
    { type: "connectivity", label: "Conectividad" },
    { type: "material", label: "Material" },
    { type: "dimensions", label: "Dimensiones" },
    { type: "weight", label: "Peso" },
    { type: "graphics", label: "Gráficos" },
    { type: "ports", label: "Puertos" },
    { type: "wireless", label: "Inalámbrico" },
    { type: "color", label: "Color" },
    { type: "warranty", label: "Garantía" },
    { type: "other", label: "Otro" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    categoryName: '',
    subcategory: '',
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
  });
  const [formErrors, setFormErrors] = useState({});

  // Estados para formularios dinámicos
  const [newSpecification, setNewSpecification] = useState({ type: '', label: '', value: '' });
  const [newFeature, setNewFeature] = useState('');
  const [newVariant, setNewVariant] = useState({ name: '', color: '#000000', available: true });
  const [newTag, setNewTag] = useState('');

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
    const matchesCategory = !selectedCategory || 
                           product.category === selectedCategory || 
                           product.categoryName?.toLowerCase().includes(selectedCategory.toLowerCase());
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
        return (a.stockQuantity || a.stock || 0) - (b.stockQuantity || b.stock || 0);
      case 'created':
        return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
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
      originalPrice: '',
      category: '',
      categoryName: '',
      subcategory: '',
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
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    if (!product.isFromAdmin) {
      alert('Solo puedes editar productos que hayas creado en el panel administrativo.');
      return;
    }
    
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category: product.category,
      categoryName: product.categoryName || '',
      subcategory: product.subcategory || '',
      subcategoryName: product.subcategoryName || '',
      brand: product.brand,
      model: product.model || '',
      stock: (product.stock || product.stockQuantity || 0).toString(),
      stockQuantity: (product.stockQuantity || product.stock || 0).toString(),
      image: product.image,
      images: product.images || [product.image],
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
  };

  const handleViewProduct = (product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    if (!product.isFromAdmin) {
      alert('Solo puedes eliminar productos que hayas creado en el panel administrativo.');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      deleteProduct(product.id);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    if (!formData.price || formData.price <= 0) errors.price = 'El precio debe ser mayor a 0';
    if (!formData.category) errors.category = 'La categoría es requerida';
    if (!formData.brand) errors.brand = 'La marca es requerida';
    if (!formData.stockQuantity || formData.stockQuantity < 0) errors.stockQuantity = 'El stock debe ser 0 o mayor';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProduct = () => {
    if (!validateForm()) return;

    // Calcular precio original y descuento
    const price = parseFloat(formData.price);
    const originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : null;
    const discount = originalPrice && originalPrice > price ? 
      Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: price,
      originalPrice: originalPrice,
      category: formData.category,
      categoryName: getCategoryDisplayName(formData.category),
      subcategory: formData.subcategory || formData.category,
      subcategoryName: formData.subcategoryName || getCategoryDisplayName(formData.category),
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
      reviews: parseInt(formData.reviews),
      totalReviews: parseInt(formData.totalReviews),
      tags: formData.tags,
      warranty: formData.warranty,
      shipping: formData.shipping,
      specifications: formData.specifications,
      features: formData.features,
      variants: formData.variants
    };

    if (modalMode === 'add') {
      addProduct(productData);
    } else if (modalMode === 'edit') {
      updateProduct(selectedProduct.id, productData);
    }

    setShowModal(false);
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'tecnologia': 'Tecnología',
      'hogar': 'Hogar y Jardín',
      'deportes': 'Deportes y Fitness',
      'salud': 'Salud y Belleza',
      'moda': 'Moda y Ropa',
      'libros': 'Libros y Media'
    };
    return categoryMap[category] || category;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'stockQuantity') {
      setFormData(prev => ({
        ...prev,
        stock: value,
        inStock: parseInt(value) > 0
      }));
    }

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Funciones para manejar especificaciones
  const addSpecification = () => {
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
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Funciones para manejar características
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Funciones para manejar variantes
  const addVariant = () => {
    if (newVariant.name.trim()) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }]
      }));
      setNewVariant({ name: '', color: '#000000', available: true });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  // Funciones para manejar tags
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Funciones para manejar imágenes
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const getStockStatus = (product) => {
    const stock = product.stockQuantity || product.stock || 0;
    if (stock === 0) return { label: 'Sin Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 5) return { label: 'Stock Bajo', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'En Stock', color: 'bg-green-100 text-green-800' };
  };

  const ProductModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
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
            // Vista de solo lectura (mantener el código existente)
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
                    <div>
                      <span className="text-sm text-gray-500">Categoría</span>
                      <p className="font-medium">{selectedProduct?.categoryName || selectedProduct?.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Marca</span>
                      <p className="font-medium">{selectedProduct?.brand}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {selectedProduct?.isActive !== false && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Activo</span>
                    )}
                    {selectedProduct?.isFeatured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Destacado</span>
                    )}
                    {selectedProduct?.isNew && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Nuevo</span>
                    )}
                    {selectedProduct?.isFromAdmin && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Admin</span>
                    )}
                  </div>
                  
                  {/* Mostrar especificaciones */}
                  {selectedProduct?.specifications && selectedProduct.specifications.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2">Especificaciones</h5>
                      <div className="space-y-1">
                        {selectedProduct.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">{spec.label}:</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Mostrar características */}
                  {selectedProduct?.features && selectedProduct.features.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-2">Características</h5>
                      <ul className="text-sm space-y-1">
                        {selectedProduct.features.map((feature, index) => (
                          <li key={index} className="text-gray-600">• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Formulario completo
            <form className="space-y-8">
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
                      Modelo
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Original
                    </label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1800000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Para mostrar descuentos</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Categoría y Marca */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Categorización</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <option key={category} value={category}>{getCategoryDisplayName(category)}</option>
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
                        onChange={(e) => updateImageField(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`URL de imagen ${index + 1}`}
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageField}
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
                
                {/* Lista de especificaciones actuales */}
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
                            onClick={() => removeSpecification(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar nueva especificación */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={newSpecification.type}
                    onChange={(e) => {
                      const selectedType = specificationTypes.find(t => t.type === e.target.value);
                      setNewSpecification(prev => ({
                        ...prev,
                        type: e.target.value,
                        label: selectedType ? selectedType.label : ''
                      }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Tipo de especificación</option>
                    {specificationTypes.map(type => (
                      <option key={type.type} value={type.type}>{type.label}</option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={newSpecification.label}
                    onChange={(e) => setNewSpecification(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Etiqueta"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <input
                    type="text"
                    value={newSpecification.value}
                    onChange={(e) => setNewSpecification(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Valor"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <button
                    type="button"
                    onClick={addSpecification}
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
                
                {/* Lista de características actuales */}
                {formData.features.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Características agregadas:</h5>
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                          <span className="text-sm">{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar nueva característica */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Ej: Pantalla OLED de alta resolución"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Variantes */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Variantes de Color</h4>
                
                {/* Lista de variantes actuales */}
                {formData.variants.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Variantes agregadas:</h5>
                    <div className="space-y-2">
                      {formData.variants.map((variant, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: variant.color }}
                            />
                            <span className="text-sm font-medium">{variant.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              variant.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {variant.available ? 'Disponible' : 'No disponible'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariant(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar nueva variante */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del color"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newVariant.color}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                      className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{newVariant.color}</span>
                  </div>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newVariant.available}
                      onChange={(e) => setNewVariant(prev => ({ ...prev, available: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm">Disponible</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={addVariant}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Agregar
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4">Tags</h4>
                
                {/* Lista de tags actuales */}
                {formData.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agregar nuevo tag */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ej: premium, wireless, gaming"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 sticky bottom-0">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {modalMode === 'view' ? 'Cerrar' : 'Cancelar'}
          </button>
          {modalMode !== 'view' && (
            <button
              onClick={handleSaveProduct}
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
                <option key={category} value={category}>{getCategoryDisplayName(category)}</option>
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
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                        {product.categoryName || product.category}
                      </span>
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
                      <div className="flex space-x-1">
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

      {/* Modal */}
      {showModal && <ProductModal />}
    </div>
  );
};

export default ProductManager;
