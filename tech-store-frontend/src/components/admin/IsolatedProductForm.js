import React, { useState } from 'react';
import { slugify, generateUniqueSlug } from '../../utils/slugify';
import { supabase } from '../../supabaseClient';

const IsolatedProductForm = () => {
  // Estado completamente local, sin contextos
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Generar slug
    const productSlug = formData.slug || slugify(formData.name);
    
    // Verificar que el slug sea único
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('slug', productSlug)
      .neq('id', formData.id || 0)
      .single();
    
    if (existingProduct) {
      alert('Ya existe un producto con este nombre. El slug debe ser único.');
      return;
    }

    const productData = {
      ...formData,
      slug: productSlug,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    // Guardar en Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) throw error;

    console.log('Producto guardado:', data);
    alert('¡Producto creado exitosamente!');
    
    // Limpiar formulario
    setFormData({
      name: '', description: '', price: '', category: '', brand: '', stock: '', slug: ''
    });
  } catch (error) {
    console.error('Error al guardar producto:', error);
    alert('Error al guardar el producto: ' + error.message);
  }
};
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Formulario Aislado - Prueba</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-sm font-medium mb-2">Nombre del Producto</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: iPhone 15 Pro"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="1500000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar</option>
              <option value="tecnologia">Tecnología</option>
              <option value="hogar">Hogar</option>
              <option value="deportes">Deportes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Marca</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ej: Apple"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
  <label className="block text-sm font-medium mb-2">
    URL Slug (opcional)
    <span className="text-xs text-gray-500 ml-2">Se genera automáticamente si se deja vacío</span>
  </label>
  <input
    type="text"
    name="slug"
    value={formData.slug}
    onChange={handleChange}
    placeholder="iphone-15-pro"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  />
</div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Descripción del producto..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Guardar Producto
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              name: '', description: '', price: '', category: '', brand: '', stock: ''
            })}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Limpiar
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Datos actuales:</h3>
        <pre className="text-sm">{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default IsolatedProductForm;
