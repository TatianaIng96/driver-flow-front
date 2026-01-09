import { Search, Plus, Filter } from 'lucide-react';
import type { Driver } from '../App';

interface DriversListProps {
  drivers: Driver[];
  onSelectDriver: (id: string) => void;
}

export function DriversList({ drivers, onSelectDriver }: DriversListProps) {
  const getStatusBadge = (status: Driver['status']) => {
    const badges = {
      active: { label: 'Activo', className: 'bg-green-100 text-green-700' },
      inactive: { label: 'Inactivo', className: 'bg-gray-100 text-gray-700' },
      vacation: { label: 'Vacaciones', className: 'bg-blue-100 text-blue-700' },
    };
    return badges[status];
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Gestión de Conductores</h1>
        <p className="text-gray-600">Administra el estado y la información de todos los conductores</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conductor por nombre o teléfono..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Nuevo Conductor
          </button>
        </div>
      </div>

      {/* Lista de Conductores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const statusBadge = getStatusBadge(driver.status);
          
          return (
            <div
              key={driver.id}
              onClick={() => onSelectDriver(driver.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Header con foto y estado */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-500 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1 truncate">{driver.name}</h3>
                  <p className="text-gray-600 truncate">{driver.phone}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
                {driver.isBanned && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                    🚫 Vetado
                  </span>
                )}
              </div>

              {/* Info adicional */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Documento:</span>
                  <span className="text-gray-900">{driver.document}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Grupos:</span>
                  <span className="text-gray-900">{driver.groups.length}</span>
                </div>
                {driver.lastLocation && (
                  <div className="flex items-center gap-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Ubicación activa</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
