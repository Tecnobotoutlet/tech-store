// src/components/admin/AdminSettings.js - Configuraciones del Sistema
import React, { useState } from 'react';
import { 
  Save, 
  Settings, 
  Globe, 
  Shield, 
  Mail, 
  Bell, 
  CreditCard,
  Package,
  Truck,
  Database,
  Key,
  Eye,
  EyeOff,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Palette,
  Monitor,
  Smartphone,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Estados para configuraciones
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'TechStore',
    storeDescription: 'Tu tienda de confianza para productos de todas las categorías',
    storeEmail: 'contacto@techstore.com',
    storePhone: '+57 300 123 4567',
    storeAddress: 'Bogotá, Colombia',
    currency: 'COP',
    language: 'es',
    timezone: 'America/Bogota',
    logo: null,
    favicon: null
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 200000,
    localShippingCost: 15000,
    nationalShippingCost: 25000,
    internationalShipping: false,
    shippingZones: [
      { name: 'Bogotá', cost: 10000, estimatedDays: '1-2' },
      { name: 'Cundinamarca', cost: 15000, estimatedDays: '2-3' },
      { name: 'Nacional', cost: 25000, estimatedDays: '3-5' }
    ]
  });

  const [paymentSettings, setPaymentSettings] = useState({
    wompiEnabled: true,
    wompiPublicKey: 'pub_test_xxxxxxxxxxxxxxxx',
    wompiPrivateKey: 'prv_test_xxxxxxxxxxxxxxxx',
    cashOnDelivery: true,
    bankTransfer: true,
    paymentMethods: {
      creditCard: true,
      debitCard: true,
      pse: true,
      nequi: true,
      daviplata: false
    }
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@techstore.com',
    smtpPassword: '',
    smtpSecure: true,
    emailFrom: 'TechStore <noreply@techstore.com>',
    orderConfirmation: true,
    paymentConfirmation: true,
    shippingNotification: true,
    promotionalEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requirePasswordChange: 90,
    apiRateLimit: 100,
    maintenanceMode: false,
    backupFrequency: 'daily',
    lastBackup: '2025-01-20 10:30:00'
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'TechStore - Tu tienda de tecnología',
    metaDescription: 'Encuentra los mejores productos tecnológicos al mejor precio. Envío gratis, garantía y soporte 24/7.',
    metaKeywords: 'tecnología, smartphones, laptops, audio, gaming',
    googleAnalytics: '',
    googleTagManager: '',
    facebookPixel: '',
    sitemap: true,
    robotsTxt: true
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveSettings = (settingsType) => {
    // Aquí implementarías la lógica para guardar en el backend
    showNotification(`Configuraciones de ${settingsType} guardadas exitosamente`);
  };

  const handleExportSettings = () => {
    const allSettings = {
      general: generalSettings,
      shipping: shippingSettings,
      payment: paymentSettings,
      email: emailSettings,
      security: securitySettings,
      seo: seoSettings
    };
    
    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'techstore-settings.json';
    link.click();
    
    showNotification('Configuraciones exportadas exitosamente');
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target.result);
          if (settings.general) setGeneralSettings(settings.general);
          if (settings.shipping) setShippingSettings(settings.shipping);
          if (settings.payment) setPaymentSettings(settings.payment);
          if (settings.email) setEmailSettings(settings.email);
          if (settings.security) setSecuritySettings(settings.security);
          if (settings.seo) setSeoSettings(settings.seo);
          showNotification('Configuraciones importadas exitosamente');
        } catch (error) {
          showNotification('Error al importar configuraciones', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'shipping', name: 'Envíos', icon: Truck },
    { id: 'payment', name: 'Pagos', icon: CreditCard },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'seo', name: 'SEO', icon: Globe }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Tienda</label>
            <input
              type="text"
              value={generalSettings.storeName}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
            <input
              type="email"
              value={generalSettings.storeEmail}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              value={generalSettings.storePhone}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, storePhone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={generalSettings.storeAddress}
              onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeAddress: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción de la Tienda</label>
        <textarea
          value={generalSettings.storeDescription}
          onChange={(e) => setGeneralSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
          <select
            value={generalSettings.currency}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="COP">Peso Colombiano (COP)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
          <select
            value={generalSettings.language}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
          <select
            value={generalSettings.timezone}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Bogota">Bogotá (GMT-5)</option>
            <option value="America/New_York">Nueva York (GMT-5)</option>
            <option value="Europe/Madrid">Madrid (GMT+1)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Envíos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Envío Gratis Desde</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Costo Envío Local</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={shippingSettings.localShippingCost}
                onChange={(e) => setShippingSettings(prev => ({ ...prev, localShippingCost: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Costo Envío Nacional</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={shippingSettings.nationalShippingCost}
                onChange={(e) => setShippingSettings(prev => ({ ...prev, nationalShippingCost: parseInt(e.target.value) }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={shippingSettings.internationalShipping}
            onChange={(e) => setShippingSettings(prev => ({ ...prev, internationalShipping: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Habilitar envíos internacionales</label>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-3">Zonas de Envío</h4>
        <div className="space-y-3">
          {shippingSettings.shippingZones.map((zone, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) => {
                    const newZones = [...shippingSettings.shippingZones];
                    newZones[index].name = e.target.value;
                    setShippingSettings(prev => ({ ...prev, shippingZones: newZones }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre de la zona"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  value={zone.cost}
                  onChange={(e) => {
                    const newZones = [...shippingSettings.shippingZones];
                    newZones[index].cost = parseInt(e.target.value);
                    setShippingSettings(prev => ({ ...prev, shippingZones: newZones }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Costo"
                />
              </div>
              <div className="w-24">
                <input
                  type="text"
                  value={zone.estimatedDays}
                  onChange={(e) => {
                    const newZones = [...shippingSettings.shippingZones];
                    newZones[index].estimatedDays = e.target.value;
                    setShippingSettings(prev => ({ ...prev, shippingZones: newZones }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Días"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Pagos</h3>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={paymentSettings.wompiEnabled}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, wompiEnabled: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">Habilitar Wompi</label>
          </div>
          
          {paymentSettings.wompiEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clave Pública Wompi</label>
                <input
                  type="text"
                  value={paymentSettings.wompiPublicKey}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, wompiPublicKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="pub_test_xxxxxxxxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clave Privada Wompi</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={paymentSettings.wompiPrivateKey}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, wompiPrivateKey: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="prv_test_xxxxxxxxxxxxxxxx"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Métodos de Pago Habilitados</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(paymentSettings.paymentMethods).map(([method, enabled]) => (
              <div key={method} className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setPaymentSettings(prev => ({
                    ...prev,
                    paymentMethods: { ...prev.paymentMethods, [method]: e.target.checked }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700 capitalize">
                  {method === 'creditCard' ? 'Tarjeta de Crédito' :
                   method === 'debitCard' ? 'Tarjeta Débito' :
                   method === 'pse' ? 'PSE' :
                   method === 'nequi' ? 'Nequi' :
                   method === 'daviplata' ? 'Daviplata' : method}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paymentSettings.cashOnDelivery}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, cashOnDelivery: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Pago contra entrega</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={paymentSettings.bankTransfer}
              onChange={(e) => setPaymentSettings(prev => ({ ...prev, bankTransfer: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Transferencia bancaria</label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración SMTP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Servidor SMTP</label>
            <input
              type="text"
              value={emailSettings.smtpHost}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Puerto</label>
            <input
              type="number"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input
              type="email"
              value={emailSettings.smtpUser}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={emailSettings.smtpSecure}
              onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpSecure: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Usar conexión segura (TLS)</label>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Notificaciones por Email</h4>
        <div className="space-y-3">
          {[
            { key: 'orderConfirmation', label: 'Confirmación de pedido' },
            { key: 'paymentConfirmation', label: 'Confirmación de pago' },
            { key: 'shippingNotification', label: 'Notificación de envío' },
            { key: 'promotionalEmails', label: 'Emails promocionales' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={emailSettings[key]}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">{label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</h4>
              <p className="text-sm text-gray-600">Añade una capa extra de seguridad</p>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Modo Mantenimiento</h4>
              <p className="text-sm text-gray-600">Desactiva temporalmente la tienda</p>
            </div>
            <input
              type="checkbox"
              checked={securitySettings.maintenanceMode}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de Sesión (minutos)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Máximo Intentos de Login</label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitud Mínima Contraseña</label>
            <input
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Límite API por hora</label>
            <input
              type="number"
              value={securitySettings.apiRateLimit}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Respaldos</h4>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-900">Último respaldo: {securitySettings.lastBackup}</p>
            <p className="text-xs text-gray-600">Frecuencia: {securitySettings.backupFrequency}</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Crear Respaldo
          </button>
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración SEO</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Título</label>
            <input
              type="text"
              value={seoSettings.metaTitle}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, metaTitle: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">{seoSettings.metaTitle.length}/60 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meta Descripción</label>
            <textarea
              value={seoSettings.metaDescription}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, metaDescription: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">{seoSettings.metaDescription.length}/160 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Palabras Clave</label>
            <input
              type="text"
              value={seoSettings.metaKeywords}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, metaKeywords: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="palabra1, palabra2, palabra3"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Códigos de Seguimiento</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics</label>
            <input
              type="text"
              value={seoSettings.googleAnalytics}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, googleAnalytics: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Tag Manager</label>
            <input
              type="text"
              value={seoSettings.googleTagManager}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, googleTagManager: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GTM-XXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel</label>
            <input
              type="text"
              value={seoSettings.facebookPixel}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, facebookPixel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="XXXXXXXXXXXXXXX"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Configuración Automática</h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={seoSettings.sitemap}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, sitemap: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Generar sitemap.xml automáticamente</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={seoSettings.robotsTxt}
              onChange={(e) => setSeoSettings(prev => ({ ...prev, robotsTxt: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Generar robots.txt automáticamente</label>
          </div>
        </div>
      </div>
    </div>
  );

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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuraciones del Sistema</h2>
            <p className="text-gray-600">Administra las configuraciones generales de tu tienda</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <label
              htmlFor="import-settings"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Importar
            </label>
            <button
              onClick={handleExportSettings}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'shipping' && renderShippingSettings()}
        {activeTab === 'payment' && renderPaymentSettings()}
        {activeTab === 'email' && renderEmailSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'seo' && renderSEOSettings()}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => handleSaveSettings(activeTab)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;