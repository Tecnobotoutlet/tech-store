// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
  const [metrics, setMetrics] = useState({
    revenue: {
      current: 2480000,
      previous: 2100000,
      trend: 18.1
    },
    orders: {
      current: 156,
      previous: 132,
      trend: 18.2
    },
    customers: {
      current: 1234,
      previous: 1156,
      trend: 6.7
    },
    products: {
      current: 89,
      previous: 87,
      trend: 2.3
    }
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: '#ORD-001',
      customer: 'Juan Pérez',
      total: 156000,
      status: 'pending',
      date: '2025-01-15 10:30'
    },
    {
      id: '#ORD-002',
      customer: 'María González',
      total: 89000,
      status: 'processing',
      date: '2025-01-15 09:15'
    },
    {
      id: '#ORD-003',
      customer: 'Carlos Rodríguez',
      total: 234000,
      status: 'shipped',
      date: '2025-01-14 16:45'
    },
    {
      id: '#ORD-004',
      customer: 'Ana López',
      total: 67000,
      status: 'delivered',
      date: '2025-01-14 14:20'
    }
  ]);

  const [topProducts, setTopProducts] = useState([
    {
      name: 'iPhone 15 Pro Max',
      sales: 45,
      revenue: 1350000,
      trend: 12.5
    },
    {
      name: 'MacBook Air M2',
      sales: 23,
      revenue: 920000,
      trend: -2.1
    },
    {
      name: 'AirPods Pro',
      sales: 67,
      revenue: 536000,
      trend: 8.3
    },
    {
      name: 'iPad Pro',
      sales: 18,
      revenue: 450000,
      trend: 15.7
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      processing: AlertCircle,
      shipped: Package,
      delivered: CheckCircle,
      cancelled: AlertCircle
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const MetricCard = ({ title, value, previousValue, trend, icon: IconComponent, format = 'number' }) => {
    const isPositive = trend > 0;
    const formattedValue = format === 'currency' ? formatCurrency(value) : value.toLocaleString();

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{formattedValue}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-2" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs período anterior</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general de tu negocio</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ingresos"
          value={metrics.revenue.current}
          previousValue={metrics.revenue.previous}
          trend={metrics.revenue.trend}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Pedidos"
          value={metrics.orders.current}
          previousValue={metrics.orders.previous}
          trend={metrics.orders.trend}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Clientes"
          value={metrics.customers.current}
          previousValue={metrics.customers.previous}
          trend={metrics.customers.trend}
          icon={Users}
        />
        <MetricCard
          title="Productos"
          value={metrics.products.current}
          previousValue={metrics.products.previous}
          trend={metrics.products.trend}
          icon={Package}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver todos
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Ver reporte
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} ventas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  <div className="flex items-center">
                    {product.trend > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${product.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(product.trend)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de ventas y alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder para gráfico */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Ventas en el Tiempo</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de ventas</p>
              <p className="text-sm text-gray-400">Se implementará con Chart.js</p>
            </div>
          </div>
        </div>

        {/* Alertas y notificaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Alertas</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Stock Bajo</p>
                  <p className="text-xs text-yellow-600">3 productos con menos de 5 unidades</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Pedidos Pendientes</p>
                  <p className="text-xs text-blue-600">12 pedidos esperando procesamiento</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">Nueva Reseña</p>
                  <p className="text-xs text-green-600">iPhone 15 Pro - 5 estrellas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;