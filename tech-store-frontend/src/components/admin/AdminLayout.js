// src/components/admin/AdminLayout.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  Tag,
  TrendingUp,
  DollarSign,
  ShoppingBag
} from 'lucide-react';

const AdminLayout = ({ children, currentSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Resumen y métricas'
    },
    {
      id: 'products',
      label: 'Productos',
      icon: Package,
      description: 'Gestión de inventario'
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: Tag,
      description: 'Organizar productos'
    },
    {
      id: 'orders',
      label: 'Pedidos',
      icon: ShoppingCart,
      description: 'Gestión de ventas'
    },
    {
      id: 'customers',
      label: 'Clientes',
      icon: Users,
      description: 'Base de clientes'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Settings,
      description: 'Ajustes generales'
    }
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const Sidebar = () => (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">TechStore</h1>
            <p className="text-sm text-gray-400">Panel Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-sm text-gray-400">Administrador</div>
          </div>
        </div>
        <button
          onClick={onBackToStore}
          className="w-full flex items-center space-x-2 px-3 py-2 mb-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Volver a la Tienda</span>
        </button>
              
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block w-80 fixed h-full">
        <Sidebar />
      </div>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-80 h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-80">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 capitalize">
                  {currentSection}
                </h2>
                <p className="text-sm text-gray-600">
                  {menuItems.find(item => item.id === currentSection)?.description}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-gray-500">Pedidos Hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$2.4M</div>
                <div className="text-xs text-gray-500">Ventas Mes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-xs text-gray-500">Productos</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
