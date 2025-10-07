// src/services/userService.js
import { supabase } from '../supabaseClient';

export const userService = {
  // ==================== PERFIL DE USUARIO ====================
  
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          date_of_birth: profileData.dateOfBirth,
          document_type: profileData.documentType,
          document_number: profileData.documentNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // ==================== DIRECCIONES ====================

  async getUserAddresses(userId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  async createAddress(userId, addressData) {
    try {
      // Si es la dirección predeterminada, quitar default de las demás
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert([{
          user_id: userId,
          address_type: addressData.address_type || 'both',
          full_name: addressData.full_name,
          phone: addressData.phone,
          address_line1: addressData.address_line1,
          address_line2: addressData.address_line2,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: addressData.country || 'Colombia',
          additional_info: addressData.additional_info,
          is_default: addressData.is_default || false
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  },

  async updateAddress(addressId, userId, addressData) {
    try {
      // Si es la dirección predeterminada, quitar default de las demás
      if (addressData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .update({
          address_type: addressData.address_type,
          full_name: addressData.full_name,
          phone: addressData.phone,
          address_line1: addressData.address_line1,
          address_line2: addressData.address_line2,
          city: addressData.city,
          state: addressData.state,
          postal_code: addressData.postal_code,
          country: addressData.country,
          additional_info: addressData.additional_info,
          is_default: addressData.is_default,
          updated_at: new Date().toISOString()
        })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  async deleteAddress(addressId, userId) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  async setDefaultAddress(addressId, userId) {
    try {
      // Quitar default de todas
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Establecer nueva default
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
  },

  // ==================== PEDIDOS ====================

  async getUserOrders(userId) {
  try {
    console.log('📦 Cargando pedidos para user:', userId);
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          product_name,
          product_image,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error en getUserOrders:', error);
      throw error;
    }

    console.log('✅ Pedidos cargados:', data?.length || 0);
    
    // Transformar datos para compatibilidad
    const ordersWithFormattedItems = (data || []).map(order => ({
      ...order,
      order_number: order.id, // Agregar order_number si no existe
      order_items: (order.order_items || []).map(item => ({
        ...item,
        price: item.unit_price // Mapear unit_price a price para compatibilidad
      }))
    }));

    return ordersWithFormattedItems;
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    throw error;
  }
},

  async getOrderDetails(orderId, userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            subtotal
          )
        `)
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // ==================== ESTADÍSTICAS ====================

  async getUserStats(userId) {
    try {
      // Obtener pedidos
      const { data: orders } = await supabase
        .from('orders')
        .select('total, status, payment_status, created_at')
        .eq('user_id', userId);

      // Calcular estadísticas
      const totalOrders = orders?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
      const totalSpent = orders
        ?.filter(o => o.payment_status === 'paid')
        ?.reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;

      // Obtener perfil
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('created_at')
        .eq('id', userId)
        .single();

      const memberSince = profile?.created_at 
        ? new Date(profile.created_at).toLocaleDateString('es-CO', { 
            year: 'numeric', 
            month: 'long' 
          })
        : 'Reciente';

      const lastOrder = orders?.[0];
      const lastOrderDate = lastOrder?.created_at
        ? new Date(lastOrder.created_at).toLocaleDateString('es-CO')
        : 'Sin pedidos';

      return {
        totalOrders,
        completedOrders,
        totalSpent,
        memberSince,
        lastOrderDate,
        favoriteCategory: 'Tecnología' // Puedes calcular esto desde order_items
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // ==================== ADMIN: GESTIÓN DE USUARIOS ====================

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
            avatar: user.avatar_url,
            verified: user.email_verified
          };
        })
      );

      return usersWithStats;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

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
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

export default userService;
