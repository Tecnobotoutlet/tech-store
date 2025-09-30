// src/services/orderService.js
import { supabase } from '../supabaseClient';




export const orderService = {
  // Obtener todos los pedidos con items
  async getAllOrders() {
    try {
      const { data: orders, error } = await supabase
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
            discount,
            subtotal
          ),
          payments (
            id,
            amount,
            payment_method,
            transaction_id,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return orders.map(order => ({
        id: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        total: parseFloat(order.total),
        subtotal: parseFloat(order.subtotal),
        shippingCost: parseFloat(order.shipping_cost || 0),
        tax: parseFloat(order.tax || 0),
        discount: parseFloat(order.discount || 0),
        status: order.status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        paymentReference: order.payment_reference,
        shippingAddress: `${order.shipping_address_line1}, ${order.shipping_city}, ${order.shipping_state}`,
        shippingFullAddress: {
          fullName: order.shipping_full_name,
          phone: order.shipping_phone,
          addressLine1: order.shipping_address_line1,
          addressLine2: order.shipping_address_line2,
          city: order.shipping_city,
          state: order.shipping_state,
          postalCode: order.shipping_postal_code,
          country: order.shipping_country
        },
        trackingNumber: order.tracking_number,
        items: order.order_items.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.product_name,
          image: item.product_image,
          quantity: item.quantity,
          price: parseFloat(item.unit_price),
          discount: parseFloat(item.discount || 0),
          subtotal: parseFloat(item.subtotal)
        })),
        customerNotes: order.customer_notes,
        adminNotes: order.admin_notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        confirmedAt: order.confirmed_at,
        shippedAt: order.shipped_at,
        deliveredAt: order.delivered_at,
        cancelledAt: order.cancelled_at,
        dbId: order.id
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Obtener un pedido específico
  async getOrderById(orderId) {
    try {
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
            discount,
            subtotal
          ),
          payments (
            id,
            amount,
            payment_method,
            transaction_id,
            status
          )
        `)
        .eq('order_number', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  async updateOrderStatus(orderNumber, newStatus) {
    try {
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Agregar timestamps específicos según el estado
      if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      } else if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
        // Generar número de tracking si no existe
        if (!updateData.tracking_number) {
          updateData.tracking_number = `TRK${Date.now()}`;
        }
      } else if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      } else if (newStatus === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('order_number', orderNumber)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Actualizar número de tracking
  async updateTrackingNumber(orderNumber, trackingNumber) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString()
        })
        .eq('order_number', orderNumber)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating tracking number:', error);
      throw error;
    }
  },

  // Actualizar notas del administrador
  async updateAdminNotes(orderNumber, notes) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          admin_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('order_number', orderNumber)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating admin notes:', error);
      throw error;
    }
  },

  // Crear un nuevo pedido
  async createOrder(orderData) {
    try {
      // Generar número de pedido único
      const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          user_id: orderData.userId,
          customer_email: orderData.customerEmail,
          customer_name: orderData.customerName,
          customer_phone: orderData.customerPhone,
          shipping_full_name: orderData.shippingAddress.fullName,
          shipping_phone: orderData.shippingAddress.phone,
          shipping_address_line1: orderData.shippingAddress.addressLine1,
          shipping_address_line2: orderData.shippingAddress.addressLine2,
          shipping_city: orderData.shippingAddress.city,
          shipping_state: orderData.shippingAddress.state,
          shipping_postal_code: orderData.shippingAddress.postalCode,
          shipping_country: orderData.shippingAddress.country || 'Colombia',
          subtotal: orderData.subtotal,
          shipping_cost: orderData.shippingCost || 0,
          tax: orderData.tax || 0,
          discount: orderData.discount || 0,
          total: orderData.total,
          payment_method: orderData.paymentMethod,
          customer_notes: orderData.customerNotes
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insertar items del pedido
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        unit_price: item.price,
        discount: item.discount || 0,
        subtotal: item.quantity * item.price - (item.discount || 0)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Obtener estadísticas de pedidos
  async getOrderStats() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status, total, payment_status, created_at');

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(o => o.status === 'pending').length,
        processing: data.filter(o => o.status === 'processing').length,
        shipped: data.filter(o => o.status === 'shipped').length,
        delivered: data.filter(o => o.status === 'delivered').length,
        cancelled: data.filter(o => o.status === 'cancelled').length,
        totalRevenue: data
          .filter(o => o.payment_status === 'paid')
          .reduce((sum, o) => sum + parseFloat(o.total), 0),
        todayOrders: data.filter(o => {
          const orderDate = new Date(o.created_at);
          const today = new Date();
          return orderDate.toDateString() === today.toDateString();
        }).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }
};

export default orderService;
