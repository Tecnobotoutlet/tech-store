// src/theme.js - Configuración de tema Mixxo
export const mixxoTheme = {
  colors: {
    // Colores principales del logo
    primary: {
      pink: '#E91E63',
      pinkDark: '#C2185B',
      pinkLight: '#F06292',
      cyan: '#00BCD4',
      cyanDark: '#0097A7',
      cyanLight: '#4DD0E1',
      purple: '#9C27B0',
      purpleLight: '#BA68C8'
    },
    
    // Gradientes del logo
    gradients: {
      main: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 50%, #00BCD4 100%)',
      pink: 'linear-gradient(135deg, #F06292 0%, #E91E63 100%)',
      cyan: 'linear-gradient(135deg, #4DD0E1 0%, #00BCD4 100%)',
      purple: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)',
      reverse: 'linear-gradient(135deg, #00BCD4 0%, #9C27B0 50%, #E91E63 100%)',
      diagonal: 'linear-gradient(45deg, #E91E63 0%, #9C27B0 50%, #00BCD4 100%)',
      radial: 'radial-gradient(circle, #E91E63 0%, #9C27B0 50%, #00BCD4 100%)'
    },
    
    // Colores de soporte
    neutral: {
      white: '#FFFFFF',
      gray50: '#FAFAFA',
      gray100: '#F5F5F5',
      gray200: '#EEEEEE',
      gray300: '#E0E0E0',
      gray400: '#BDBDBD',
      gray500: '#9E9E9E',
      gray600: '#757575',
      gray700: '#616161',
      gray800: '#424242',
      gray900: '#212121',
      black: '#000000'
    },
    
    // Estados
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3'
  },
  
  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    colored: '0 10px 30px -5px rgba(233, 30, 99, 0.3)',
    coloredCyan: '0 10px 30px -5px rgba(0, 188, 212, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  
  // Bordes redondeados
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    full: '9999px'
  },
  
  // Espaciado
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  
  // Tipografía
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace'
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem'
  },
  
  // Animaciones
  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out'
  }
};

// Clases de utilidad para Tailwind
export const mixxoClasses = {
  button: {
    primary: 'bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300',
    secondary: 'bg-white text-pink-600 border-2 border-pink-500 hover:bg-pink-50 font-semibold shadow-md hover:shadow-lg transition-all duration-300',
    outline: 'border-2 border-gradient text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-500 hover:bg-gradient-to-r hover:from-pink-600 hover:to-cyan-600 font-semibold transition-all duration-300'
  },
  
  card: {
    base: 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
    gradient: 'bg-gradient-to-br from-pink-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
    bordered: 'bg-white border-2 border-gray-200 rounded-2xl hover:border-pink-300 transition-all duration-300'
  },
  
  badge: {
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold',
    cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold',
    gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-semibold'
  },
  
  text: {
    gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent font-bold',
    pink: 'text-pink-600 font-semibold',
    cyan: 'text-cyan-600 font-semibold'
  }
};

export default mixxoTheme;