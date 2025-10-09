// src/services/userService.js - COMPLETO
import { supabase } from '../supabaseClient';

export const userService = {
  // Obtener todos los usuarios con sus estadísticas
  async getAllUsers() {
    try {
      // Obtener perfiles de usuarios
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Obtener estadísticas de órdenes para cada usuario
      const usersWithStats = await Promise.all(
        profiles.map(async (profile) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total, status')
            .eq('user_id', profile.id);

          const totalOrders = orders?.length || 0;
          const totalSpent = orders?.reduce((sum, order) => {
            return sum + (parseFloat(order.total) || 0);
          }, 0) || 0;

          return {
            id: profile.id,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email,
            phone: profile.phone || '',
            role: profile.role || 'customer',
            status: profile.is_active ? 'active' : 'inactive',
            verified: profile.email_verified || false,
            createdAt: profile.created_at,
            lastLogin: profile.last_login,
            orders: totalOrders,
            totalSpent: totalSpent
          };
        })
      );

      return usersWithStats;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('Error al obtener la lista de usuarios');
    }
  },

  // Obtener un usuario específico con detalles completos
  async getUserById(userId) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Obtener estadísticas de órdenes
      const { data: orders } = await supabase
        .from('orders')
        .select('total, status, created_at')
        .eq('user_id', userId);

      const totalOrders = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => {
        return sum + (parseFloat(order.total) || 0);
      }, 0) || 0;

      return {
        id: profile.id,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email,
        phone: profile.phone || '',
        role: profile.role || 'customer',
        status: profile.is_active ? 'active' : 'inactive',
        verified: profile.email_verified || false,
        createdAt: profile.created_at,
        lastLogin: profile.last_login,
        orders: totalOrders,
        totalSpent: totalSpent
      };
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw new Error('Error al obtener los detalles del usuario');
    }
  },

  // 🔥 ACTUALIZAR USUARIO (incluye cambio de rol)
  async updateUser(userId, updateData) {
    try {
      console.log('📝 Actualizando usuario:', userId, updateData);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: updateData.firstName,
          last_name: updateData.lastName,
          phone: updateData.phone,
          role: updateData.role, // 🔥 CRÍTICO: Actualizar el rol
          is_active: updateData.status === 'active',
          email_verified: updateData.verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Usuario actualizado en BD:', data);

      return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        status: data.is_active ? 'active' : 'inactive',
        verified: data.email_verified
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error(error.message || 'Error al actualizar el usuario');
    }
  },

  // Actualizar solo el estado del usuario
  async updateUserStatus(userId, isActive) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error al actualizar estado del usuario:', error);
      throw new Error('Error al actualizar el estado del usuario');
    }
  },

  // Desactivar usuario (soft delete)
  async deleteUser(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error('Error al eliminar el usuario');
    }
  },

  // Buscar usuarios
  async searchUsers(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(profile => ({
        id: profile.id,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email,
        phone: profile.phone || '',
        role: profile.role || 'customer',
        status: profile.is_active ? 'active' : 'inactive',
        verified: profile.email_verified || false,
        createdAt: profile.created_at,
        lastLogin: profile.last_login
      }));
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw new Error('Error al buscar usuarios');
    }
  },

  // Verificar email del usuario
  async verifyUserEmail(userId) {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          email_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error al verificar email:', error);
      throw new Error('Error al verificar el email del usuario');
    }
  },

  // Obtener estadísticas generales de usuarios
  async getUserStats() {
    try {
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('role, is_active, email_verified');

      if (error) throw error;

      const stats = {
        total: profiles.length,
        active: profiles.filter(p => p.is_active).length,
        inactive: profiles.filter(p => !p.is_active).length,
        admins: profiles.filter(p => p.role === 'admin').length,
        customers: profiles.filter(p => p.role === 'customer').length,
        verified: profiles.filter(p => p.email_verified).length
      };

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw new Error('Error al obtener estadísticas de usuarios');
    }
  }
};

export default userService;
