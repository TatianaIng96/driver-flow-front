import { Users, Building2, MessageSquare, CheckCircle, Clock, Ban, MapPin } from 'lucide-react';
import type { AppState } from '../App';

interface AdminDashboardProps {
  appState: AppState;
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ appState, onNavigate }: AdminDashboardProps) {
  const stats = {
    activeDrivers: appState.drivers.filter((d) => d.status === 'active').length,
    inactiveDrivers: appState.drivers.filter((d) => d.status === 'inactive').length,
    vacationDrivers: appState.drivers.filter((d) => d.status === 'vacation').length,
    totalClients: appState.clients.length,
    totalGroups: appState.groups.length,
    servicesInProgress: appState.services.filter((s) => s.status === 'taken').length,
    servicesCompleted: appState.services.filter((s) => s.status === 'completed').length,
    bannedNumbers: appState.bannedNumbers.length,
  };

  const activeDriversWithLocation = appState.drivers.filter(
    (d) => d.status === 'active' && d.lastLocation
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Dashboard Principal</h1>
        <p className="text-gray-600">Vista general del sistema DriverFlow</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Conductores Activos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('drivers')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Activos</span>
          </div>
          <div className="text-gray-900 mb-1">{stats.activeDrivers}</div>
          <p className="text-gray-600">Conductores Activos</p>
        </div>

        {/* Conductores Inactivos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('drivers')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">Inactivos</span>
          </div>
          <div className="text-gray-900 mb-1">{stats.inactiveDrivers}</div>
          <p className="text-gray-600">Conductores Inactivos</p>
        </div>

        {/* Conductores en Vacaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('drivers')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Vacaciones</span>
          </div>
          <div className="text-gray-900 mb-1">{stats.vacationDrivers}</div>
          <p className="text-gray-600">En Vacaciones</p>
        </div>

        {/* Total Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('clients')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalClients}</div>
          <p className="text-gray-600">Total Clientes</p>
        </div>

        {/* Grupos Creados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('groups')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.totalGroups}</div>
          <p className="text-gray-600">Grupos WhatsApp</p>
        </div>

        {/* Servicios en Curso */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('services')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.servicesInProgress}</div>
          <p className="text-gray-600">Servicios en Curso</p>
        </div>

        {/* Servicios Completados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('services')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.servicesCompleted}</div>
          <p className="text-gray-600">Servicios Completados</p>
        </div>

        {/* Números Vetados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate('banned')}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-gray-900 mb-1">{stats.bannedNumbers}</div>
          <p className="text-gray-600">Números Vetados</p>
        </div>
      </div>

      {/* Mapa de Conductores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-1">Conductores Activos - Ubicación en Tiempo Real</h2>
            <p className="text-gray-600">{activeDriversWithLocation.length} conductores con ubicación disponible</p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Ver Mapa Completo
          </button>
        </div>

        {/* Mapa Simplificado */}
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
          {/* Grid de fondo para simular mapa */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />

          {/* Conductores en el mapa */}
          {activeDriversWithLocation.map((driver, index) => {
            const x = 20 + (index % 4) * 22;
            const y = 15 + Math.floor(index / 4) * 25;
            
            return (
              <div
                key={driver.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onNavigate('map')}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                  driver.isBanned ? 'bg-red-500' : 'bg-green-500'
                } animate-pulse`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {driver.name}
                </div>
              </div>
            );
          })}

          {/* Leyenda */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-700">Inactivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Vetado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
