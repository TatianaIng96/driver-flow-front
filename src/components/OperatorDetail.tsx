import { useState } from 'react';
import { ArrowLeft, Users, Building2, MessageSquare, Mail, Phone, Calendar, Save } from 'lucide-react';
import type { Operator, Driver, Client, Group, OperatorSettings as OperatorSettingsType } from '../App';

interface OperatorDetailProps {
  operator: Operator;
  drivers: Driver[];
  clients: Client[];
  groups: Group[];
  onBack: () => void;
  onUpdateSettings: (operatorId: string, settings: Partial<OperatorSettingsType>) => void;
}

export function OperatorDetail({ operator, drivers, clients, groups, onBack, onUpdateSettings }: OperatorDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState(operator.settings);

  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter((d) => d.status === 'active').length,
    totalClients: clients.length,
    totalGroups: groups.length,
  };

  const handleSave = () => {
    onUpdateSettings(operator.id, settings);
    setIsEditing(false);
    alert('Configuración actualizada');
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Volver a Operadores
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-gray-900 mb-2">{operator.name}</h1>
                <span className={`px-3 py-1 rounded-full ${
                  operator.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {operator.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{operator.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{operator.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Creado: {new Date(operator.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-blue-900">{stats.totalDrivers}</div>
                <p className="text-blue-700">Conductores</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Building2 className="w-6 h-6 text-purple-600 mb-2" />
                <div className="text-purple-900">{stats.totalClients}</div>
                <p className="text-purple-700">Clientes</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <MessageSquare className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-green-900">{stats.totalGroups}</div>
                <p className="text-green-700">Grupos</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-lg">
                <Users className="w-6 h-6 text-teal-600 mb-2" />
                <div className="text-teal-900">{stats.activeDrivers}</div>
                <p className="text-teal-700">Activos</p>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">Configuración</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre Base de Grupos</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={settings.groupBaseName}
                    onChange={(e) => setSettings({ ...settings, groupBaseName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{settings.groupBaseName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Foto del Grupo</label>
                {isEditing ? (
                  <input
                    type="url"
                    value={settings.groupPhoto}
                    onChange={(e) => setSettings({ ...settings, groupPhoto: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <img src={settings.groupPhoto} alt="Group" className="w-16 h-16 rounded-full object-cover" />
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Máximo Clientes por Grupo</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={settings.maxClientsPerGroup}
                    onChange={(e) => setSettings({ ...settings, maxClientsPerGroup: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{settings.maxClientsPerGroup} clientes</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-blue-900 mb-3">Información</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• ID: {operator.id}</li>
              <li>• Conductores se agregan a todos los grupos</li>
              <li>• Clientes solo en un grupo</li>
              <li>• Grupos se crean automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
