import React, { useState } from 'react';

const TestForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  console.log('TestForm render');
  
  return (
    <div className="p-6">
      <h2>Formulario de Prueba</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del producto"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
};

export default TestForm;