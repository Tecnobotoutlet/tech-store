// src/services/authService.js
// Simulación de base de datos de usuarios
const MOCK_USERS = [
  {
    id: 1,
    firstName: 'Admin',
    lastName: 'TechStore',
    email: 'admin@techstore.com',
    phone: '+57 300 123 4567',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    lastLogin: '2025-09-26T08:30:00Z'
  },
  {
    id: 2,
    firstName: 'Usuario',
    lastName: 'Ejemplo',
    email: 'user@example.com',
    phone: '+57 300 987 6543',
    password: 'user123',
    role: 'user',
    createdAt: '2024-02-20T14:30:00Z',
    lastLogin: '2025-09-25T16:45:00Z'
  }
];

// Simulación de delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generar token JWT simulado
const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  }));
  const signature = btoa('fake-signature');
  return `${header}.${payload}.${signature}`;
};

// Verificar token
const verifyToken = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp < currentTime) return null;
    
    return payload;
  } catch (error) {
    return null;
  }
};

// Servicio de autenticación
export const authService = {
  // Login
  async login(email, password) {
    await delay(800); // Simular latencia de red
    
    const user = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    
    // Actualizar último login
    user.lastLogin = new Date().toISOString();
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token,
      message: 'Login exitoso'
    };
  },

  // Registro
  async register(userData) {
    await delay(1000);
    
    // Verificar si el email ya existe
    const existingUser = MOCK_USERS.find(u => 
      u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    // Verificar si el teléfono ya existe
    const existingPhone = MOCK_USERS.find(u => u.phone === userData.phone);
    if (existingPhone) {
      throw new Error('El teléfono ya está registrado');
    }
    
    // Crear nuevo usuario
    const newUser = {
      id: MOCK_USERS.length + 1,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      password: userData.password,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    MOCK_USERS.push(newUser);
    
    const token = generateToken(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    
    return {
      user: userWithoutPassword,
      token,
      message: 'Registro exitoso'
    };
  },

  // Verificar token
  async verifyToken(token) {
    await delay(300);
    
    const payload = verifyToken(token);
    if (!payload) {
      throw new Error('Token inválido');
    }
    
    const user = MOCK_USERS.find(u => u.id === payload.id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  },

  // Actualizar perfil
  async updateProfile(userId, updateData, token) {
    await delay(600);
    
    const payload = verifyToken(token);
    if (!payload || payload.id !== userId) {
      throw new Error('Token inválido');
    }
    
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Verificar si el nuevo email ya existe (si se está cambiando)
    if (updateData.email && updateData.email !== MOCK_USERS[userIndex].email) {
      const existingUser = MOCK_USERS.find(u => 
        u.email.toLowerCase() === updateData.email.toLowerCase() && u.id !== userId
      );
      if (existingUser) {
        throw new Error('El email ya está en uso');
      }
    }
    
    // Verificar si el nuevo teléfono ya existe (si se está cambiando)
    if (updateData.phone && updateData.phone !== MOCK_USERS[userIndex].phone) {
      const existingPhone = MOCK_USERS.find(u => 
        u.phone === updateData.phone && u.id !== userId
      );
      if (existingPhone) {
        throw new Error('El teléfono ya está en uso');
      }
    }
    
    // Actualizar usuario
    MOCK_USERS[userIndex] = {
      ...MOCK_USERS[userIndex],
      ...updateData,
      email: updateData.email ? updateData.email.toLowerCase() : MOCK_USERS[userIndex].email
    };
    
    const { password: _, ...userWithoutPassword } = MOCK_USERS[userIndex];
    return {
      user: userWithoutPassword,
      message: 'Perfil actualizado correctamente'
    };
  },

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword, token) {
    await delay(700);
    
    const payload = verifyToken(token);
    if (!payload || payload.id !== userId) {
      throw new Error('Token inválido');
    }
    
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    if (user.password !== currentPassword) {
      throw new Error('Contraseña actual incorrecta');
    }
    
    user.password = newPassword;
    
    return {
      message: 'Contraseña actualizada correctamente'
    };
  },

  // Obtener perfil
  async getProfile(token) {
    await delay(400);
    
    const payload = verifyToken(token);
    if (!payload) {
      throw new Error('Token inválido');
    }
    
    const user = MOCK_USERS.find(u => u.id === payload.id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  },

  // Recuperar contraseña (simulado)
  async forgotPassword(email) {
    await delay(1000);
    
    const user = MOCK_USERS.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!user) {
      throw new Error('No se encontró una cuenta con ese email');
    }
    
    // En un sistema real, aquí se enviaría un email con un link de recuperación
    return {
      message: 'Se ha enviado un email con instrucciones para recuperar tu contraseña'
    };
  },

  // Obtener estadísticas del usuario (para el dashboard)
  async getUserStats(userId, token) {
    await delay(500);
    
    const payload = verifyToken(token);
    if (!payload || payload.id !== userId) {
      throw new Error('Token inválido');
    }
    
    // Simular estadísticas
    return {
      totalOrders: Math.floor(Math.random() * 20) + 1,
      totalSpent: Math.floor(Math.random() * 5000000) + 500000,
      favoriteCategory: ['Smartphones', 'Laptops', 'Tablets'][Math.floor(Math.random() * 3)],
      memberSince: '2024-02-20',
      lastOrderDate: '2025-09-20'
    };
  }
};

// Interceptor para manejar errores de autenticación globalmente
export const handleAuthError = (error) => {
  if (error.message.includes('Token inválido') || error.message.includes('Token expired')) {
    // Limpiar token inválido
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    // Redirigir al login o mostrar modal
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
  throw error;
};

// Utilidad para obtener el token actual
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Utilidad para obtener los datos del usuario actual
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  
  const payload = verifyToken(token);
  return payload !== null;
};

export default authService;