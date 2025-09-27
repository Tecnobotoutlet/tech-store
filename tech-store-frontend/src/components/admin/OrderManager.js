// src/components/admin/OrderManager.js
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Printer
} from 'lucide-react';

const OrderManager = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customerName: 'Juan Pérez',
      customerEmail: 'juan@email.com',
      customerPhone: '+57 300 123 4567',
      total: 1560000,
      status: 'pending',
      paymentStatus: 'approved',
      paymentMethod: 'credit_card',
      shippingAddress: 'Calle 123 #45-67, Bogotá',
      items: [
        { name: 'iPhone 15 Pro Max', quantity: 1, price: 1560000 }
      ],
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 'ORD-002',
      customerName: 'María González',
      customerEmail: 'maria@email.com',
      customerPhone: '+57 300 987 6543',
      total: 890000,
      status: 'processing',
      paymentStatus: 'approved',
      paymentMethod: 'credit_card',
      shippingAddress: 'Carrera 7 #89-01, Medellín',
      items: [
        { name: 'MacBook Air M2', quantity: 1, price: 890000 }
      ],
      createdAt: '2025-01-15T09:15:00Z',
      updatedAt: '2025-01-15T11:20:00Z'
    },
    {
      id: 'ORD-003',
      customerName: 'Carlos Rodríguez',
      customerEmail: 'carlos@email.com',
      customerPhone: '+57 300 456 7890',
      total: 2340000,
      status: 'shipped',
      paymentStatus: 'approved',
      paymentMethod: 'debit_card',
      shippingAddress: 'Avenida 68 #12-34, Cali',
      trackingNumber: 'TRK123456789',
      items: [
        { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 1340000 },
        { name: 'AirPods Pro', quantity: 1, price: 1000000 }
      ],
      createdAt: '2025-01-14T16:45:00Z',
      updatedAt: '2025-01-15T14:30:00Z',
      shippedAt: '2025-01-15T14:30:00Z'
    },
    {
      id: 'ORD-004',
      customerName: 'Ana López',
      customerEmail: 'ana@email.com',
      customerPhone: '+57 300 111 2222',
      total: 670000,
      status: 'delivered',
      paymentStatus: 'approved',
      paymentMethod: 'credit_card',
      shippingAddress: 'Calle 85 #15-23, Barranquilla',
      trackingNumber: 'TRK987654321',
      items: [
        { name: 'iPad Pro', quantity: 1, price: 670000 }
      ],
      createdAt: '2025-01-14T14:20:00Z',
      updatedAt: '2025-01-15T16:00:00Z',
      shippedAt: '2025-01-15T08:00:00Z',
      deliveredAt: '2025-01-15T16:00:00Z'
    },
    {
      id: 'ORD-005',
      customerName: 'Luis Martínez',
      customerEmail: 'luis@email.com',
      customerPhone: '+57 300 333 4444',
      total: 450000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'credit_card',
      shippingAddress: 'Carrera 15 #67-89, Bucaramanga',
      items: [
        { name: 'Apple Watch Series 9', quantity: 1, price: 450000 }
      ],
      createdAt: '2025-01-13T12:00:00Z',
      updatedAt: '2025-01-13T18:00:00Z',
      cancelledAt: '2025-01-13T18:00:00Z',
      cancelReason: 'Solicitud del cliente'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [sortBy, setSortBy] = useState('created_desc');

  const orderStatuses = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'processing', label: 'Procesando', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    { value: 'shipped', label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
    { value: 'delivered', label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'approved', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
    { value: 'declined', label: 'Rechazado', color: 'bg-red-100 text-red-800' },
    { value: 'refunded', label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  const getPaymentStatusInfo = (status) => {
    return paymentStatuses.find(s => s.value === status) || paymentStatuses[0];
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    
    // Filtro de fecha
    let matchesDate = true;
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffTime = now - orderDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateRange) {
        case 'today':
          matchesDate = diffDays <= 1;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'created_desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'created_asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'total_desc':
        return b.total - a.total;
      case 'total_asc':
        return a.total - b.total;
      case 'customer':
        return a.customerName.localeCompare(b.customerName);
      default:
        return 0;
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };

        // Agregar campos específicos según el estado
        if (newStatus === 'shipped') {
          updatedOrder.shippedAt = new Date().toISOString();
          updatedOrder.trackingNumber = `TRK${Date.now()}`;
        } else if (newStatus === 'delivered') {
          updatedOrder.deliveredAt = new Date().toISOString();
        } else if (newStatus === 'cancelled') {
          updatedOrder.cancelledAt = new Date().toISOString();
          updatedOrder.cancelReason = 'Cancelado por administrador';
        }

        return updatedOrder;
      }
      return order;
    }));
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    const statusInfo = getStatusInfo(selectedOrder.status);
    const paymentInfo = getPaymentStatusInfo(selectedOrder.paymentStatus);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-xl font-semibold">Pedido {selectedOrder.id}</h3>
              <p className="text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Printer className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowOrderModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Estado y acciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Estado del Pedido</h4>
                <div className="flex items-center space-x-3 mb-4">
                  <StatusIcon className="w-5 h-5" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrder.id, e.target.value);
                    setSelectedOrder({...selectedOrder, status: e.target.value});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Estado del Pago</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentInfo.color}`}>
                  {paymentInfo.label}
                </span>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Método: {selectedOrder.paymentMethod === 'credit_card' ? 'Tarjeta de Crédito' : 'Tarjeta de Débito'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Información del Cliente</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <span>{selectedOrder.shippingAddress}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>Tracking: {selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Productos */}
            <div>
              <h4 className="font-semibold mb-3">Productos</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Producto</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cantidad</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Precio Unit.</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">{item.name}</td>
                        <td className="px-4 py-3 text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-3 text-sm font-medium">{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-semibold">Total:</td>
                      <td className="px-4 py-3 font-bold text-lg">{formatCurrency(selectedOrder.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="font-semibold mb-3">Historial</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-500">{formatDate(selectedOrder.createdAt)}</span>
                  <span>Pedido creado</span>
                </div>
                {selectedOrder.shippedAt && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-500">{formatDate(selectedOrder.shippedAt)}</span>
                    <span>Pedido enviado</span>
                  </div>
                )}
                {selectedOrder.deliveredAt && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-500">{formatDate(selectedOrder.deliveredAt)}</span>
                    <span>Pedido entregado</span>
                  </div>
                )}
                {selectedOrder.cancelledAt && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-500">{formatDate(selectedOrder.cancelledAt)}</span>
                    <span>Pedido cancelado - {selectedOrder.cancelReason}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              onClick={() => setShowOrderModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">Administra y realiza seguimiento a las ventas</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ID, cliente, email..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pago</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los pagos</option>
              {paymentStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_desc">Más recientes</option>
              <option value="created_asc">Más antiguos</option>
              <option value="total_desc">Mayor valor</option>
              <option value="total_asc">Menor valor</option>
              <option value="customer">Cliente A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">
            Pedidos ({sortedOrders.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pago</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const paymentInfo = getPaymentStatusInfo(order.paymentStatus);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-2" />
                        <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${paymentInfo.color}`}>
                        {paymentInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                        >
                          {orderStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle */}
      {showOrderModal && <OrderDetailModal />}
    </div>
  );
};

export default OrderManager;