// src/utils/cityValidator.js

/**
 * Lista de ciudades principales de Colombia donde está disponible
 * el servicio de pago contra entrega (Cash on Delivery)
 */
export const ELIGIBLE_COD_CITIES = [
  // Ciudades principales
  'Bogotá',
  'Bogota',
  'Bogotá D.C.',
  'Medellín',
  'Medellin',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Cúcuta',
  'Cucuta',
  'Pereira',
  'Santa Marta',
  'Ibagué',
  'Ibague',
  'Villavicencio',
  'Pasto',
  'Manizales',
  'Neiva',
  'Armenia',
  'Popayán',
  'Popayan',
  'Valledupar',
  'Montería',
  'Monteria',
  'Sincelejo',
  'Tunja',
  'Palmira',
  'Bello',
  'Soacha',
  'Envigado',
  'Itagüí',
  'Itagui',
  'Soledad',
  'Floridablanca',
  'Dosquebradas',
  'Rionegro'
];

/**
 * Palabras clave que indican zonas rurales NO elegibles
 */
const RURAL_KEYWORDS = [
  'vereda',
  'corregimiento',
  'finca',
  'parcela',
  'hacienda',
  'km ',
  'kilometro',
  'kilómetro',
  'rural',
  'vía ',
  'via '
];

/**
 * Normaliza el texto removiendo acentos y convirtiéndolo a minúsculas
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .trim();
};

/**
 * Verifica si una ciudad es elegible para pago contra entrega
 * @param {string} city - Nombre de la ciudad
 * @returns {boolean} - true si la ciudad es elegible
 */
export const isEligibleForCOD = (city) => {
  if (!city || typeof city !== 'string') {
    return false;
  }

  const normalizedCity = normalizeText(city);
  
  // Verificar si la ciudad está en la lista de ciudades elegibles
  const isEligible = ELIGIBLE_COD_CITIES.some(eligibleCity => {
    const normalizedEligible = normalizeText(eligibleCity);
    return normalizedCity === normalizedEligible || 
           normalizedCity.includes(normalizedEligible) ||
           normalizedEligible.includes(normalizedCity);
  });

  return isEligible;
};

/**
 * Verifica si una dirección contiene indicadores de zona rural
 * @param {string} address - Dirección completa
 * @returns {boolean} - true si parece ser zona rural
 */
export const isRuralAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return false;
  }

  const normalizedAddress = normalizeText(address);
  
  return RURAL_KEYWORDS.some(keyword => 
    normalizedAddress.includes(normalizeText(keyword))
  );
};

/**
 * Verifica si una ubicación (ciudad + dirección) es elegible para COD
 * @param {string} city - Nombre de la ciudad
 * @param {string} address - Dirección completa (opcional)
 * @returns {Object} - { eligible: boolean, reason: string }
 */
export const validateCODEligibility = (city, address = '') => {
  // Verificar si la ciudad es elegible
  if (!isEligibleForCOD(city)) {
    return {
      eligible: false,
      reason: `Pago contra entrega no disponible en ${city}. Solo está disponible en ciudades principales de Colombia.`
    };
  }

  // Verificar si la dirección parece ser rural
  if (address && isRuralAddress(address)) {
    return {
      eligible: false,
      reason: 'El pago contra entrega no está disponible en zonas rurales, veredas o corregimientos.'
    };
  }

  return {
    eligible: true,
    reason: `Pago contra entrega disponible en ${city}`
  };
};

/**
 * Obtiene el nombre formal de la ciudad
 * @param {string} city - Nombre de la ciudad (puede tener variaciones)
 * @returns {string} - Nombre formal de la ciudad
 */
export const getFormalCityName = (city) => {
  const cityMap = {
    'bogota': 'Bogotá D.C.',
    'medellin': 'Medellín',
    'cucuta': 'Cúcuta',
    'ibague': 'Ibagué',
    'popayan': 'Popayán',
    'monteria': 'Montería',
    'itagui': 'Itagüí'
  };

  const normalized = normalizeText(city);
  return cityMap[normalized] || city;
};

/**
 * Retorna lista de ciudades elegibles formateadas
 * @returns {Array} - Array de objetos con nombre y departamento
 */
export const getCODCitiesList = () => {
  return [
    { name: 'Bogotá D.C.', department: 'Cundinamarca' },
    { name: 'Medellín', department: 'Antioquia' },
    { name: 'Cali', department: 'Valle del Cauca' },
    { name: 'Barranquilla', department: 'Atlántico' },
    { name: 'Cartagena', department: 'Bolívar' },
    { name: 'Bucaramanga', department: 'Santander' },
    { name: 'Cúcuta', department: 'Norte de Santander' },
    { name: 'Pereira', department: 'Risaralda' },
    { name: 'Santa Marta', department: 'Magdalena' },
    { name: 'Ibagué', department: 'Tolima' },
    { name: 'Villavicencio', department: 'Meta' },
    { name: 'Pasto', department: 'Nariño' },
    { name: 'Manizales', department: 'Caldas' },
    { name: 'Neiva', department: 'Huila' },
    { name: 'Armenia', department: 'Quindío' },
    { name: 'Popayán', department: 'Cauca' },
    { name: 'Valledupar', department: 'Cesar' },
    { name: 'Montería', department: 'Córdoba' },
    { name: 'Sincelejo', department: 'Sucre' },
    { name: 'Tunja', department: 'Boyacá' }
  ];
};