import React, { useState } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Monitor, 
  Zap, 
  Smartphone, 
  Camera, 
  Wifi, 
  Palette,
  Weight,
  Ruler,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

const ProductSpecs = ({ specifications = [] }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Mapeo de iconos para diferentes tipos de especificaciones
  const getSpecIcon = (type) => {
    const iconMap = {
      processor: Cpu,
      ram: Cpu,
      storage: HardDrive,
      display: Monitor,
      battery: Zap,
      camera: Camera,
      connectivity: Wifi,
      material: Palette,
      weight: Weight,
      dimensions: Ruler,
      os: Smartphone,
      graphics: Monitor,
      ports: Wifi,
      charging: Zap,
      driver: Camera,
      frequency: Wifi,
      anc: Camera,
      controls: Smartphone,
      keyboard: Smartphone,
      cooling: Zap,
      spen: Smartphone
    };
    
    return iconMap[type] || Info;
  };

  // Agrupar especificaciones por categorías
  const groupSpecifications = (specs) => {
    const groups = {
      'Rendimiento': ['processor', 'ram', 'graphics', 'cooling'],
      'Almacenamiento': ['storage'],
      'Pantalla': ['display'],
      'Cámara': ['camera'],
      'Batería y Carga': ['battery', 'charging'],
      'Conectividad': ['connectivity', 'ports', 'wifi'],
      'Audio': ['driver', 'frequency', 'anc', 'controls'],
      'Diseño y Build': ['material', 'weight', 'dimensions'],
      'Sistema': ['os'],
      'Características Especiales': ['spen', 'keyboard', 'cooling']
    };

    const groupedSpecs = {};
    
    // Inicializar grupos
    Object.keys(groups).forEach(groupName => {
      groupedSpecs[groupName] = [];
    });

    // Asignar especificaciones a grupos
    specs.forEach(spec => {
      let assigned = false;
      Object.entries(groups).forEach(([groupName, types]) => {
        if (types.includes(spec.type)) {
          groupedSpecs[groupName].push(spec);
          assigned = true;
        }
      });
      
      // Si no se asignó a ningún grupo, ponerla en "Otras"
      if (!assigned) {
        if (!groupedSpecs['Otras']) {
          groupedSpecs['Otras'] = [];
        }
        groupedSpecs['Otras'].push(spec);
      }
    });

    // Filtrar grupos vacíos
    Object.keys(groupedSpecs).forEach(groupName => {
      if (groupedSpecs[groupName].length === 0) {
        delete groupedSpecs[groupName];
      }
    });

    return groupedSpecs;
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const groupedSpecs = groupSpecifications(specifications);

  if (!specifications || specifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay especificaciones técnicas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4">Especificaciones técnicas</h3>
        <p className="text-gray-600 mb-6">
          Información detallada sobre las características y capacidades del producto.
        </p>
      </div>

      {/* Vista agrupada */}
      <div className="space-y-4">
        {Object.entries(groupedSpecs).map(([groupName, specs]) => (
          <div key={groupName} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header del grupo */}
            <button
              onClick={() => toggleSection(groupName)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
              <h4 className="text-lg font-medium text-gray-900">{groupName}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{specs.length} especificación{specs.length !== 1 ? 'es' : ''}</span>
                {expandedSections[groupName] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {/* Contenido del grupo */}
            {(expandedSections[groupName] !== false) && (
              <div className="px-6 py-4 bg-white">
                <div className="space-y-4">
                  {specs.map((spec, index) => {
                    const IconComponent = getSpecIcon(spec.type);
                    return (
                      <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-1 sm:mb-0">
                              <h5 className="text-sm font-medium text-gray-900">
                                {spec.label || spec.type}
                              </h5>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-gray-700 font-medium">
                                {spec.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Vista de tabla completa */}
      <div className="mt-8">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Especificaciones completas</h4>
          </div>
          <div className="bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Característica
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especificación
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {specifications.map((spec, index) => {
                    const IconComponent = getSpecIcon(spec.type);
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <IconComponent className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {spec.label || spec.type}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {spec.value}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Notas adicionales */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Nota importante:</p>
            <p>
              Las especificaciones pueden variar según la región y están sujetas a cambios sin previo aviso. 
              Para información más detallada, consulta la documentación oficial del fabricante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecs;