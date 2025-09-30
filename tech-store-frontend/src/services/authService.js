// src/services/authService.js - Con Supabase Auth Real
import { createClient } from '@supabase/supabase-js';



export const authService = {
  // Registro
  async register(userData) {
    try {
      // Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone
          }
        }
      });

      if (authError) throw authError;

      // Crear perfil en user_profiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone || '',
            role: 'customer',
            is_active: true,
            email_verified: false
          }]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        // Obtener perfil completo
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        return {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            firstName: profile?.first_name || userData.firstName,
            lastName: profile?.last_name || userData.lastName,
            phone: profile?.phone || userData.phone,
            role: profile?.role || 'customer',
            emailVerified: authData.user.email_confirmed_at !== null
          },
          token: authData.session?.access_token,
          message: 'Registro exitoso'
        };
      }

      throw new Error('Error al crear usuario');
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al registrar usuario');
    }
  },

  // Login
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Obtener perfil del usuario
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // Actualizar last_login
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          phone: profile?.phone || '',
          role: profile?.role || 'customer',
          emailVerified: data.user.email_confirmed_at !== null
        },
        token: data.session.access_token,
        message: 'Login exitoso'
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Credenciales incorrectas');
    }
  },

  // Verificar token
  async verifyToken(token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) throw error;

      // Obtener perfil
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          phone: profile?.phone || '',
          role: profile?.role || 'customer',
          emailVerified: user.email_confirmed_at !== null
        }
      };
    } catch (error) {
      throw new Error('Token inválido');
    }
  },

  // Actualizar perfil
  async updateProfile(userId, updateData, token) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: updateData.firstName,
          last_name: updateData.lastName,
          phone: updateData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return {
        user: {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          role: data.role
        },
        message: 'Perfil actualizado'
      };
    } catch (error) {
      throw new Error('Error al actualizar perfil');
    }
  },

  // Cambiar contraseña
  async changePassword(userId, currentPassword, newPassword, token) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { message: 'Contraseña actualizada' };
    } catch (error) {
      throw new Error('Error al cambiar contraseña');
    }
  },

  // Obtener perfil
  async getProfile(token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) throw error;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: profile?.first_name || '',
          lastName: profile?.last_name || '',
          phone: profile?.phone || '',
          role: profile?.role || 'customer'
        }
      };
    } catch (error) {
      throw new Error('Error al obtener perfil');
    }
  },

  // Recuperar contraseña
  async forgotPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      return {
        message: 'Se ha enviado un email con instrucciones para recuperar tu contraseña'
      };
    } catch (error) {
      throw new Error('Error al recuperar contraseña');
    }
  },

  // Obtener estadísticas
  async getUserStats(userId, token) {
    try {
      const { data: orders } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('user_id', userId)
        .neq('status', 'cancelled');

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

      return {
        totalOrders,
        totalSpent,
        memberSince: orders?.[0]?.created_at || new Date().toISOString()
      };
    } catch (error) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        memberSince: new Date().toISOString()
      };
    }
  },

  // Logout
  async logout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
};

// Utilidades
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export const handleAuthError = (error) => {
  if (error.message.includes('Token inválido') || error.message.includes('Token expired')) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }
  throw error;
};

export default authService;
