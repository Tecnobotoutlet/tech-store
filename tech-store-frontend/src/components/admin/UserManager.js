// src/components/admin/UserManager.js - Gestión Completa de Clientes
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  CreditCard,
  ShoppingBag,
  Star,
  AlertCircle,
  CheckCircle,
  X,
  MoreVertical,
  Download,
  Upload,
  Users,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';

const UserManager = () => {
  // Datos simulados de usuarios
  const [users, setUsers] = useState([
    {
      id: 1,
      firstName: 'Carlos',
      lastName: 'Martínez',
      email: 'carlos.martinez@email.com',
      phone: '+57 300 123 4567',
      role: 'user',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2025-01-20',
      orders: 15,
      totalSpent: 2450000,
      address: 'Carrera 15 #85-32, Bogotá',
      avatar: null,
      verified: true
    },
    {
      id: 2,
      firstName: 'Ana',
      lastName: 'López',
      email: 'ana.lopez@email.com',
      phone: '+57 310 987 6543',
      role: 'user',
      status: 'active',
      createdAt: '2024-02-20',
      lastLogin: '2025-01-19',
      orders: 8,
      totalSpent: 1200000,
      address: 'Calle 100 #45-67, Bogotá',
      avatar: null,
      verified: true
    },
    {
      id: 3,
      firstName: 'Admin',
      lastName: 'TechStore',
      email: 'admin@techstore.com',
      phone: '+57 300 123 4567',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2025-01-21',
      orders: 0,
      totalSpent: 0,
      address: 'Oficina Principal',
      avatar: null,
      verified: true
    },
    {
      id: 4,
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@email.com',
      phone: '+57 320 456 7890',
      role: 'user',
      status: 'inactive',
      createdAt: '2024-03-10',
      lastLogin: '2024-12-15',
      orders: 3,
      totalSpent: 450000,
      address: 'Avenida 68 #123-45, Bogotá',
      avatar: null,
      verified: false
    },
    {
      id: 5,
      firstName: 'Roberto',
      lastName: 'Silva',
      email: 'roberto.silva@email.com',
      phone: '+57 315 789 0123',
      role: 'user',
      status: 'suspended',
      createdAt: '2024-04-05',
      lastLogin: '2025-01-10',
      orders: 25,
      totalSpent: 5200000,
      address: 'Carrera 7 #32-18, Bogotá',
      avatar: null,
      verified: true
    }
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'create'
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Estado para formulario de usuario
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    address: '',
    verified: false
  });

  useEffect(() => {
    filterUsers();
  }, [searchTerm, statusFilter, roleFilter, users]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filtro por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    if (user && type === 'edit') {
      setUserForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        address: user.address,
        verified: user.verified
      });
    } else if (type === 'create') {
      setUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        address: '',
        verified: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      address: '',
      verified: false
    });
  };

  const saveUser = () => {
    if (!userForm.firstName || !userForm.lastName || !userForm.email) {
      showNotification('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    if (modalType === 'create') {
      const newUser = {
        ...userForm,
        id: users.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        orders: 0,
        totalSpent: 0,
        avatar: null
      };
      setUsers([...users, newUser]);
      showNotification('Usuario creado exitosamente');
    } else if (modalType === 'edit') {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userForm }
          : user
      ));
      showNotification('Usuario actualizado exitosamente');
    }

    closeModal();
  };

  const deleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
      showNotification('Usuario eliminado exitosamente');
    }
  };

  const toggleUserStatus = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: newStatus }
        : user
    ));
    showNotification(`Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'} exitosamente`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.inactive;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      user: 'bg-blue-100 text-blue-800'
    };
    return colors[role] || colors.user;
  };

  const getStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const verifiedUsers = users.filter(u => u.verified).length;
    const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      verifiedUsers,
      totalRevenue
    };
  };

  const stats = getStats();

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Clientes</h2>
            <p className="text-gray-600">Administra los usuarios y clientes de tu tienda</p>
          </div>
          <button
            onClick={() => openModal('create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verificados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
                <p className="text-xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="suspended">Suspendidos</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estadísticas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acceso</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {user.firstName} {user.lastName}
                          {user.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Activo' : user.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <ShoppingBag className="w-4 h-4 text-gray-400" />
                      {user.orders} pedidos
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(user.totalSpent)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal('view', user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openModal('edit', user)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => toggleUserStatus(user.id, 'suspended')}
                          className="text-orange-600 hover:text-orange-900 p-1"
                          title="Suspender usuario"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleUserStatus(user.id, 'active')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Activar usuario"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstUser + 1}</span> a{' '}
                  <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> de{' '}
                  <span className="font-medium">{filteredUsers.length}</span> usuarios
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {modalType === 'view' ? 'Detalles del Usuario' : 
                   modalType === 'edit' ? 'Editar Usuario' : 
                   'Nuevo Usuario'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {modalType === 'view' && selectedUser && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h4>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role === 'admin' ? 'Administrador' : 'Usuario'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status === 'active' ? 'Activo' : selectedUser.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Información de Contacto</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedUser.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedUser.address}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Estadísticas</h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{selectedUser.orders} pedidos realizados</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Total gastado: {formatPrice(selectedUser.totalSpent)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Registrado: {new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">Último acceso: {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Nunca'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(modalType === 'edit' || modalType === 'create') && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        value={userForm.firstName}
                        onChange={(e) => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                      <input
                        type="text"
                        value={userForm.lastName}
                        onChange={(e) => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Apellido"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={userForm.phone}
                      onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+57 300 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                    <input
                      type="text"
                      value={userForm.address}
                      onChange={(e) => setUserForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dirección completa"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <select
                        value={userForm.role}
                        onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                      <select
                        value={userForm.status}
                        onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="suspended">Suspendido</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={userForm.verified}
                      onChange={(e) => setUserForm(prev => ({ ...prev, verified: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Usuario verificado
                    </label>
                  </div>
                </div>
              )}
            </div>

            {(modalType === 'edit' || modalType === 'create') && (
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modalType === 'create' ? 'Crear Usuario' : 'Actualizar Usuario'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;