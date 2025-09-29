// src/services/userService.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const userService = {
  // Obtener todos los usuarios con estadísticas
  async getAllUsers() {
    try {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Obtener estadísticas de pedidos para cada usuario
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          // Obtener estadísticas de pedidos
          const { data: orders } = await supabase
            .from('orders')
            .select('total')
            .eq('user_id', user.id)
            .neq('status', 'cancelled');

          const orderCount = orders?.length || 0;
          const totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

          return {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.is_active ? 'active' : 'inactive',
            createdAt: user.created_at,
            lastLogin: user.last_login,
            orders: orderCount,
            totalSpent: totalSpent,
            address: '', // Se puede obtener de la tabla addresses
            avatar: user.avatar_url,
            verified: user.email_verified,
            documentType: user.document_type,
            documentNumber: user.document_number,
            dateOfBirth: user.date_of_birth
          };
        })
      );

      return usersWithStats;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Obtener un usuario específico con dirección
  async getUserById(userId) {
    try {
      const { data: user, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          addresses (*)
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Obtener estadísticas
      const { data: orders } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', userId)
        .neq('status', 'cancelled');

      const orderCount = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.is_active ? 'active' : 'inactive',
        createdAt: user.created_at,
        lastLogin: user.last_login,
        orders: orderCount,
        totalSpent: totalSpent,
        addresses: user.addresses || [],
        avatar: user.avatar_url,
        verified: user.email_verified,
        documentType: user.document_type,
        documentNumber: user.document_number,
        dateOfBirth: user.date_of_birth
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Crear usuario (requiere auth admin)
  async createUser(userData) {
    try {
      // Nota: Crear usuarios con auth requiere permisos de admin de Supabase
      // Esta es una implementación simplificada
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password || Math.random().toString(36).slice(-8), // Generar password temporal
        email_confirm: userData.verified,
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone
        }
      });

      if (error) throw error;

      // Crear perfil
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: userData.role || 'customer',
          is_active: userData.status === 'active',
          email_verified: userData.verified
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      return profile;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: userData.role,
          is_active: userData.status === 'active',
          email_verified: userData.verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Cambiar estado del usuario
  async updateUserStatus(userId, isActive) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  // Eliminar usuario (soft delete)
  async deleteUser(userId) {
    try {
      // En lugar de eliminar, desactivar
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Obtener estadísticas de usuarios
  async getUserStats() {
    try {
      const { data: users, error } = await supabase
        .from('user_profiles')
        .select('id, role, is_active, email_verified, created_at');

      if (error) throw error;

      // Obtener ingresos totales
      const { data: orders } = await supabase
        .from('orders')
        .select('total, payment_status')
        .eq('payment_status', 'paid');

      const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
        adminUsers: users.filter(u => u.role === 'admin').length,
        verifiedUsers: users.filter(u => u.email_verified).length,
        totalRevenue: totalRevenue,
        newUsersThisMonth: users.filter(u => {
          const userDate = new Date(u.created_at);
          const now = new Date();
          return userDate.getMonth() === now.getMonth() && 
                 userDate.getFullYear() === now.getFullYear();
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Obtener direcciones de un usuario
  async getUserAddresses(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  },

  // Actualizar dirección predeterminada
  async setDefaultAddress(userId, addressId) {
    try {
      // Quitar default de todas las direcciones del usuario
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Establecer la nueva dirección por defecto
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
};

export default userService;