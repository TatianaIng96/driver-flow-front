import { Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Service, Client, Driver } from '../App';

interface ServicesListProps {
  services: Service[];
  clients: Client[];
  drivers: Driver[];
  onSelectService: (id: string) => void;
}

export function ServicesList({ services, clients, drivers, onSelectService }: ServicesListProps) {
  const getStatusBadge = (status: Service['status']) => {
    const badges = {
      available: {
        label: 'Disponible',
        className: 'bg-yellow-100 text-yellow-700',
        icon: AlertCircle,
      },
      taken: {
        label: 'En Curso',
        className: 'bg-blue-100 text-blue-700',
        icon: Clock,
      },
      completed: {
        label: 'Completado',
        className: 'bg-green-100 text-green-700',
        icon: CheckCircle,
      },
    };
    return badges[status];
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return null;
    const driver = drivers.find((d) => d.id === driverId);
    return driver?.name || 'Conductor desconocido';
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const availableServices = services.filter((s) => s.status === 'available');
  const takenServices = services.filter((s) => s.status === 'taken');
  const completedServices = services.filter((s) => s.status === 'completed');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Gestión de Servicios</h1>
        <p className="text-gray-600">Monitorea todos los servicios del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-gray-900">{availableServices.length}</div>
          </div>
          <p className="text-gray-600">Servicios Disponibles</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-gray-900">{takenServices.length}</div>
          </div>
          <p className="text-gray-600">Servicios en Curso</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-gray-900">{completedServices.length}</div>
          </div>
          <p className="text-gray-600">Servicios Completados</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar servicio por dirección o cliente..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
        </div>
      </div>

      {/* Lista de Servicios */}
      <div className="space-y-6">
        {/* Servicios Disponibles */}
        {availableServices.length > 0 && (
          <div>
            <h2 className="text-gray-900 mb-4">Servicios Disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableServices.map((service) => {
                const statusBadge = getStatusBadge(service.status);
                const Icon = statusBadge.icon;

                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusBadge.className}`}>
                        <Icon className="w-4 h-4" />
                        {statusBadge.label}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-2">{service.address}</p>
                    <p className="text-gray-600 mb-4">{formatTime(service.time)}</p>

                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-600">Cliente:</p>
                      <p className="text-gray-900">{getClientName(service.clientId)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Servicios en Curso */}
        {takenServices.length > 0 && (
          <div>
            <h2 className="text-gray-900 mb-4">Servicios en Curso</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {takenServices.map((service) => {
                const statusBadge = getStatusBadge(service.status);
                const Icon = statusBadge.icon;

                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusBadge.className}`}>
                        <Icon className="w-4 h-4" />
                        {statusBadge.label}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-2">{service.address}</p>
                    <p className="text-gray-600 mb-4">{formatTime(service.time)}</p>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-600">Cliente:</p>
                        <p className="text-gray-900">{getClientName(service.clientId)}</p>
                      </div>
                      {service.driverId && (
                        <div>
                          <p className="text-gray-600">Conductor:</p>
                          <p className="text-gray-900">{getDriverName(service.driverId)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Servicios Completados */}
        {completedServices.length > 0 && (
          <div>
            <h2 className="text-gray-900 mb-4">Servicios Completados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedServices.map((service) => {
                const statusBadge = getStatusBadge(service.status);
                const Icon = statusBadge.icon;

                return (
                  <div
                    key={service.id}
                    onClick={() => onSelectService(service.id)}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer opacity-75"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full flex items-center gap-2 ${statusBadge.className}`}>
                        <Icon className="w-4 h-4" />
                        {statusBadge.label}
                      </span>
                    </div>

                    <p className="text-gray-900 mb-2">{service.address}</p>
                    <p className="text-gray-600 mb-4">{formatTime(service.time)}</p>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-600">Cliente:</p>
                        <p className="text-gray-900">{getClientName(service.clientId)}</p>
                      </div>
                      {service.driverId && (
                        <div>
                          <p className="text-gray-600">Conductor:</p>
                          <p className="text-gray-900">{getDriverName(service.driverId)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
