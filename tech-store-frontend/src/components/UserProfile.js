// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { 
  User, 
  Lock, 
  MapPin, 
  ShoppingBag, 
  Settings, 
  X,
  Edit,
  Trash2,
  Plus,
  Check,
  ChevronRight
} from 'lucide-react';

const UserProfile = ({ onClose }) => {
  const { user, updateProfile, changePassword, showNotification } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Estado para perfil
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Estado para direcciones
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Colombia',
    additional_info: '',
    address_type: 'both',
    is_default: false
  });
  
  // Estado para pedidos
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Estado para contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estado para preferencias
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    promotions: true
  });
  
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || ''
      });
      
      if (activeTab === 'addresses') {
        loadAddresses();
      } else if (activeTab === 'orders') {
        loadOrders();
      }
    }
  }, [user, activeTab]);

  // ==================== FUNCIONES DE PERFIL ====================
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(profileData);
      setIsEditingProfile(false);
      showNotification('Perfil actualizado correctamente', 'success');
    } catch (error) {
      showNotification('Error al actualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== FUNCIONES DE DIRECCIONES ====================
  
  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await userService.getUserAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      showNotification('Error al cargar direcciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm(address);
    } else {
      setEditingAddress(null);
      setAddressForm({
        full_name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Colombia',
        additional_info: '',
        address_type: 'both',
        is_default: addresses.length === 0
      });
    }
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setEditingAddress(null);
    setErrors({});
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingAddress) {
        await userService.updateAddress(editingAddress.id, user.id, addressForm);
        showNotification('Dirección actualizada', 'success');
      } else {
        await userService.createAddress(user.id, addressForm);
        showNotification('Dirección agregada', 'success');
      }
      
      await loadAddresses();
      closeAddressModal();
    } catch (error) {
      showNotification('Error al guardar dirección', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return;
    
    setLoading(true);
    try {
      await userService.deleteAddress(addressId, user.id);
      showNotification('Dirección eliminada', 'success');
      await loadAddresses();
    } catch (error) {
      showNotification('Error al eliminar dirección', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    setLoading(true);
    try {
      await userService.setDefaultAddress(addressId, user.id);
      showNotification('Dirección predeterminada actualizada', 'success');
      await loadAddresses();
    } catch (error) {
      showNotification('Error al actualizar dirección', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== FUNCIONES DE PEDIDOS ====================
  
  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await userService.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      showNotification('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  // ==================== FUNCIONES DE CONTRASEÑA ====================
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrors({ newPassword: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showNotification('Contraseña actualizada correctamente', 'success');
    } catch (error) {
      showNotification('Error al cambiar contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==================== FUNCIONES DE PREFERENCIAS ====================
  
  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreferencesSubmit = () => {
    // Aquí guardarías las preferencias en la BD
    showNotification('Preferencias actualizadas', 'success');
  };

  // ==================== TABS ====================
  
  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'orders', label: 'Mis Pedidos', icon: ShoppingBag },
    { id: 'password', label: 'Contraseña', icon: Lock },
    { id: 'preferences', label: 'Preferencias', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">Mi Cuenta</h2>
                <p className="text-blue-100">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* MI PERFIL */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold">Información Personal</h3>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditingProfile ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-3 border rounded-lg ${!isEditingProfile ? 'bg-gray-50' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-3 border rounded-lg ${!isEditingProfile ? 'bg-gray-50' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditingProfile}
                        className={`w-full px-4 py-3 border rounded-lg ${!isEditingProfile ? 'bg-gray-50' : ''}`}
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* DIRECCIONES */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold">Mis Direcciones</h3>
                  <button
                    onClick={() => openAddressModal()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Dirección</span>
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes direcciones guardadas</p>
                    <button
                      onClick={() => openAddressModal()}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Agregar tu primera dirección
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                      <div
                        key={address.id}
                        className={`p-4 border-2 rounded-lg ${
                          address.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{address.full_name}</h4>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                          {address.is_default && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                              Predeterminada
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-1">{address.address_line1}</p>
                        {address.address_line2 && (
                          <p className="text-sm text-gray-700 mb-1">{address.address_line2}</p>
                        )}
                        <p className="text-sm text-gray-700">
                          {address.city}, {address.state}
                        </p>
                        {address.postal_code && (
                          <p className="text-sm text-gray-700">{address.postal_code}</p>
                        )}

                        <div className="flex space-x-2 mt-4 pt-4 border-t">
                          {!address.is_default && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="flex-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                              Hacer predeterminada
                            </button>
                          )}
                          <button
                            onClick={() => openAddressModal(address)}
                            className="p-2 text-gray-600 hover:text-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-2 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MIS PEDIDOS */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Historial de Pedidos</h3>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tienes pedidos aún</p>
                    <button
                      onClick={onClose}
                      className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ir a comprar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">Pedido #{order.order_number}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('es-CO')}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="text-sm text-gray-700 mb-3">
                          <p>{order.order_items?.length || 0} productos</p>
                          <p className="font-semibold text-lg mt-1">
                            ${parseFloat(order.total).toLocaleString('es-CO')}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Ver detalles
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CONTRASEÑA */}
            {activeTab === 'password' && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Cambiar Contraseña</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 border rounded-lg"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                  </button>
                </form>
              </div>
            )}

            {/* PREFERENCIAS */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-2xl font-semibold mb-6">Preferencias</h3>

                <div className="space-y-6 max-w-2xl">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Notificaciones</h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notificaciones por email</p>
                          <p className="text-sm text-gray-600">Recibir actualizaciones de pedidos</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={() => handlePreferenceChange('emailNotifications')}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notificaciones por SMS</p>
                          <p className="text-sm text-gray-600">Recibir alertas importantes</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.smsNotifications}
                          onChange={() => handlePreferenceChange('smsNotifications')}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Marketing</h4>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Newsletter</p>
                          <p className="text-sm text-gray-600">Novedades y contenido exclusivo</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.newsletter}
                          onChange={() => handlePreferenceChange('newsletter')}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Promociones</p>
                          <p className="text-sm text-gray-600">Ofertas especiales y descuentos</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferences.promotions}
                          onChange={() => handlePreferenceChange('promotions')}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handlePreferencesSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de dirección */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
              </h3>
              <button onClick={closeAddressModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={addressForm.full_name}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Dirección *</label>
                  <input
                    type="text"
                    name="address_line1"
                    value={addressForm.address_line1}
                    onChange={handleAddressChange}
                    placeholder="Calle, número, etc."
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Apartamento, suite, etc.</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={addressForm.address_line2}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ciudad *</label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Departamento/Estado *</label>
                  <input
                    type="text"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Código Postal</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={addressForm.postal_code}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">País</label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Información Adicional</label>
                  <textarea
                    name="additional_info"
                    value={addressForm.additional_info}
                    onChange={handleAddressChange}
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Ej: Portería, conjunto cerrado, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressForm.is_default}
                      onChange={handleAddressChange}
                      className="rounded"
                    />
                    <span className="text-sm">Establecer como dirección predeterminada</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Dirección'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
