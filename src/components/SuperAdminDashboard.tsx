import { Users, Building2, MessageSquare, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import type { AppState } from '../App';

interface SuperAdminDashboardProps {
  appState: AppState;
  onNavigate: (view: string) => void;
}

export function SuperAdminDashboard({ appState, onNavigate }: SuperAdminDashboardProps) {
  const stats = {
    totalOperators: appState.operators.length,
    activeOperators: appState.operators.filter((o) => o.isActive).length,
    totalDrivers: appState.drivers.length,
    totalClients: appState.clients.length,
    totalGroups: appState.groups.length,
    totalBanned: appState.bannedNumbers.length,
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard Super Administrador</h1>
        <p className="text-gray-600">Vista general de todos los operadores y su actividad</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onNavigate('operators')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {stats.activeOperators} activos
            </span>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalOperators}</div>
          <p className="text-gray-600">Usuarios Operativos</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalDrivers}</div>
          <p className="text-gray-600">Total Conductores</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalClients}</div>
          <p className="text-gray-600">Total Clientes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalGroups}</div>
          <p className="text-gray-600">Grupos WhatsApp</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalBanned}</div>
          <p className="text-gray-600">Números Vetados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">+{stats.activeOperators}</div>
          <p className="text-gray-600">Operadores Activos</p>
        </div>
      </div>

      {/* Operadores Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Operadores Recientes</h2>
          <button
            onClick={() => onNavigate('operators')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Ver Todos
          </button>
        </div>

        <div className="space-y-3">
          {appState.operators.slice(0, 5).map((operator) => (
            <div
              key={operator.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onNavigate('operator-detail', operator.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-900">{operator.name}</p>
                  <p className="text-gray-600">{operator.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {operator.isActive ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Activo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    Inactivo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen por Operador */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Resumen por Operador</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appState.operators.map((operator) => {
            const operatorDrivers = appState.drivers.filter((d) => d.operatorId === operator.id).length;
            const operatorClients = appState.clients.filter((c) => c.operatorId === operator.id).length;
            const operatorGroups = appState.groups.filter((g) => g.operatorId === operator.id).length;

            return (
              <div
                key={operator.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                onClick={() => onNavigate('operator-detail', operator.id)}
              >
                <h3 className="text-gray-900 mb-3 truncate">{operator.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Conductores:</span>
                    <span className="text-gray-900">{operatorDrivers}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Clientes:</span>
                    <span className="text-gray-900">{operatorClients}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Grupos:</span>
                    <span className="text-gray-900">{operatorGroups}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
