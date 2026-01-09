import { Search, Ban, Unlock, Users, Building2, Calendar, FileText } from 'lucide-react';
import type { BannedNumber } from '../App';

interface BannedNumbersProps {
  bannedNumbers: BannedNumber[];
  onUnban: (bannedId: string) => void;
}

export function BannedNumbers({ bannedNumbers, onUnban }: BannedNumbersProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const bannedDrivers = bannedNumbers.filter((b) => b.type === 'driver');
  const bannedClients = bannedNumbers.filter((b) => b.type === 'client');

  const handleUnban = (banned: BannedNumber) => {
    if (confirm(`¿Estás seguro de levantar el veto a ${banned.name}?`)) {
      onUnban(banned.id);
      alert('Veto levantado correctamente');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Números Vetados</h1>
        <p className="text-gray-600">Gestión completa de conductores y clientes vetados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-gray-900">{bannedNumbers.length}</div>
          </div>
          <p className="text-gray-600">Total Vetados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-gray-900">{bannedDrivers.length}</div>
          </div>
          <p className="text-gray-600">Conductores Vetados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-gray-900">{bannedClients.length}</div>
          </div>
          <p className="text-gray-600">Clientes Vetados</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o motivo..."
            className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Información sobre Vetos */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <h2 className="text-red-900 mb-4 flex items-center gap-2">
          <Ban className="w-5 h-5" />
          Reglas de Números Vetados
        </h2>
        <ul className="space-y-2 text-red-700">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0">•</span>
            <span>Los números vetados no pueden ser agregados a ningún grupo de WhatsApp.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0">•</span>
            <span>
              Los conductores vetados no pueden tomar servicios y el bot ignora sus interacciones.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0">•</span>
            <span>
              Los clientes vetados no pueden recibir servicios activos desde la plataforma.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0">•</span>
            <span>
              Si la configuración está activa, son removidos automáticamente de todos los grupos al vetar.
            </span>
          </li>
        </ul>
      </div>

      {/* Lista de Números Vetados */}
      <div className="space-y-6">
        {bannedNumbers.map((banned) => (
          <div
            key={banned.id}
            className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Icono */}
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                {banned.type === 'driver' ? (
                  <Users className="w-7 h-7 text-red-600" />
                ) : (
                  <Building2 className="w-7 h-7 text-red-600" />
                )}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{banned.name}</h3>
                    <p className="text-gray-600">{banned.phone}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      banned.type === 'driver'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {banned.type === 'driver' ? 'Conductor' : 'Cliente'}
                  </span>
                </div>

                {/* Detalles del Veto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-600">Fecha de veto</p>
                      <p className="text-gray-900">{formatDate(banned.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-600">Motivo</p>
                      <p className="text-gray-900">{banned.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleUnban(banned)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Unlock className="w-4 h-4" />
                    Levantar Veto
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4" />
                    Ver Historial
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {bannedNumbers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Ban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No hay números vetados</h3>
            <p className="text-gray-600">
              Todos los conductores y clientes están activos en el sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
