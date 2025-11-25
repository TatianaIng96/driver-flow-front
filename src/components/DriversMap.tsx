import { ArrowLeft, Users, MapPin } from 'lucide-react';
import type { Driver } from '../App';

interface DriversMapProps {
  drivers: Driver[];
  onSelectDriver: (id: string) => void;
}

export function DriversMap({ drivers, onSelectDriver }: DriversMapProps) {
  const driversWithLocation = drivers.filter((d) => d.lastLocation);
  const activeDrivers = driversWithLocation.filter((d) => d.status === 'active' && !d.isBanned);
  const inactiveDrivers = driversWithLocation.filter((d) => d.status === 'inactive');
  const bannedDrivers = driversWithLocation.filter((d) => d.isBanned);

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Mapa de Conductores en Tiempo Real</h1>
        <p className="text-gray-600">{driversWithLocation.length} conductores con ubicación disponible</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-gray-900">{activeDrivers.length}</p>
              <p className="text-gray-600">Activos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-900">{inactiveDrivers.length}</p>
              <p className="text-gray-600">Inactivos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900">{bannedDrivers.length}</p>
              <p className="text-gray-600">Vetados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
          {/* Grid de fondo para simular mapa */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Conductores en el mapa */}
          {driversWithLocation.map((driver, index) => {
            const x = 15 + (index % 5) * 17;
            const y = 15 + Math.floor(index / 5) * 20;

            const getMarkerColor = () => {
              if (driver.isBanned) return 'bg-red-500';
              if (driver.status === 'active') return 'bg-green-500';
              if (driver.status === 'inactive') return 'bg-gray-400';
              return 'bg-blue-400';
            };

            return (
              <div
                key={driver.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onSelectDriver(driver.id)}
              >
                {/* Pulso de animación */}
                <div
                  className={`absolute inset-0 ${getMarkerColor()} rounded-full opacity-25 animate-ping`}
                  style={{ width: '60px', height: '60px', left: '-10px', top: '-10px' }}
                />

                {/* Marcador */}
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${getMarkerColor()} ring-4 ring-white transition-transform group-hover:scale-125`}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white rounded-lg px-4 py-3 shadow-xl whitespace-nowrap">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={driver.photo}
                        alt={driver.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-gray-300">{driver.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-gray-700">
                      <p className="text-gray-300">
                        Estado:{' '}
                        <span className="text-white">
                          {driver.status === 'active'
                            ? 'Activo'
                            : driver.status === 'inactive'
                            ? 'Inactivo'
                            : 'Vacaciones'}
                        </span>
                      </p>
                      {driver.isBanned && (
                        <p className="text-red-400">⚠️ Vetado</p>
                      )}
                      <p className="text-gray-300">
                        Ubicación: {driver.lastLocation?.lat.toFixed(4)}, {driver.lastLocation?.lng.toFixed(4)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDriver(driver.id);
                      }}
                      className="w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
                    >
                      Ver Detalle
                    </button>
                  </div>
                  {/* Flecha del tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-900" />
                </div>
              </div>
            );
          })}

          {/* Leyenda */}
          <div className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg p-4 space-y-3 border border-gray-200">
            <h3 className="text-gray-900 mb-2">Leyenda</h3>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full ring-2 ring-white"></div>
              <span className="text-gray-700">Activo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-400 rounded-full ring-2 ring-white"></div>
              <span className="text-gray-700">Inactivo</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-400 rounded-full ring-2 ring-white"></div>
              <span className="text-gray-700">Vacaciones</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full ring-2 ring-white"></div>
              <span className="text-gray-700">Vetado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
