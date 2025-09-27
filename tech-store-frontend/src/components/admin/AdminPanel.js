// src/components/admin/AdminPanel.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import CategoryManager from './CategoryManager';
import UserManager from './UserManager';
import AdminSettings from './AdminSettings';

const AdminPanel = ({ onBackToStore }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');

  // Verificar si el usuario es admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Restringido
          </h3>
          <p className="text-gray-600 mb-6">
            Solo los administradores pueden acceder al panel de administración.
          </p>
          <button 
            onClick={onBackToStore || (() => window.location.href = '/')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManager />;
      case 'categories':
        return <CategoryManager />;
      case 'orders':
        return <OrderManager />;
      case 'customers':        
      return <UserManager />;
    case 'settings':          
      return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout 
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
      onBackToStore={onBackToStore}
    >
      {renderCurrentSection()}
    </AdminLayout>
  );
};

export default AdminPanel;