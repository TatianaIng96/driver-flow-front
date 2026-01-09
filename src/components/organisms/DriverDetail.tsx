import { useState } from 'react';
import { ArrowLeft, MapPin, MessageSquare, Ban, AlertTriangle, Save } from 'lucide-react';
import type { Driver, Group } from '../App';

interface DriverDetailProps {
  driver: Driver;
  groups: Group[];
  onBack: () => void;
  onUpdateDriver: (id: string, updates: Partial<Driver>) => void;
  onBanDriver: (id: string, reason: string) => void;
}

export function DriverDetail({ driver, groups, onBack, onUpdateDriver, onBanDriver }: DriverDetailProps) {
  const [status, setStatus] = useState(driver.status);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');

  const driverGroups = groups.filter((g) =>
    g.members.some((m) => m.type === 'driver' && m.id === driver.id)
  );

  const handleSaveStatus = () => {
    onUpdateDriver(driver.id, { status });
    alert('Estado actualizado correctamente');
  };

  const handleBan = () => {
    if (!banReason.trim()) {
      alert('Debes ingresar un motivo para vetar al conductor');
      return;
    }
    onBanDriver(driver.id, banReason);
    setShowBanModal(false);
    alert('Conductor vetado correctamente');
    onBack();
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Conductores
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Información del Conductor</h2>
            
            <div className="flex items-start gap-6 mb-6">
              <img
                src={driver.photo}
                alt={driver.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
              />
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{driver.name}</h3>
                <div className="space-y-2">
                  <div className="flex gap-2 text-gray-600">
                    <span>Teléfono:</span>
                    <span className="text-gray-900">{driver.phone}</span>
                  </div>
                  <div className="flex gap-2 text-gray-600">
                    <span>Documento:</span>
                    <span className="text-gray-900">{driver.document}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado Actual */}
            <div className="space-y-4">
              <label className="block text-gray-700">Estado Actual</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setStatus('active')}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    status === 'active'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Activo
                </button>
                <button
                  onClick={() => setStatus('inactive')}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    status === 'inactive'
                      ? 'border-gray-500 bg-gray-50 text-gray-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Inactivo
                </button>
                <button
                  onClick={() => setStatus('vacation')}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    status === 'vacation'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  Vacaciones
                </button>
              </div>
              {status !== driver.status && (
                <button
                  onClick={handleSaveStatus}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>

          {/* Última Ubicación */}
          {driver.lastLocation && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">Última Ubicación Enviada</h2>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitud:</span>
                  <span className="text-gray-900">{driver.lastLocation.lat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitud:</span>
                  <span className="text-gray-900">{driver.lastLocation.lng}</span>
                </div>
              </div>
            </div>
          )}

          {/* Grupos de WhatsApp */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Grupos de WhatsApp</h2>
            </div>
            {driverGroups.length > 0 ? (
              <div className="space-y-3">
                {driverGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-gray-900">{group.name}</p>
                      <p className="text-gray-600">
                        {group.type === 'operative'
                          ? 'Operativo'
                          : group.type === 'services'
                          ? 'Servicios'
                          : 'General'}
                      </p>
                    </div>
                    <span className="text-gray-600">{group.members.length} miembros</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No participa en ningún grupo</p>
            )}
          </div>
        </div>

        {/* Columna de Acciones */}
        <div className="space-y-6">
          {/* Estado del Conductor */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Estado del Conductor</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Estado:</span>
                <span
                  className={`px-3 py-1 rounded-full ${
                    driver.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : driver.status === 'inactive'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {driver.status === 'active'
                    ? 'Activo'
                    : driver.status === 'inactive'
                    ? 'Inactivo'
                    : 'Vacaciones'}
                </span>
              </div>
              {driver.isBanned && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
                  <Ban className="w-5 h-5" />
                  <span>Conductor Vetado</span>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Acciones</h3>
            <div className="space-y-3">
              <button className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Desactivar sin sacar de grupos
              </button>
              {!driver.isBanned && (
                <button
                  onClick={() => setShowBanModal(true)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Vetar Conductor
                </button>
              )}
            </div>
          </div>

          {/* Advertencias */}
          {driver.isBanned && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 mb-2">Conductor Vetado</p>
                  <ul className="text-red-700 space-y-1">
                    <li>• No puede tomar servicios</li>
                    <li>• El bot ignora sus interacciones</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Veto */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-6 h-6 text-red-600" />
              <h2 className="text-gray-900">Vetar Conductor</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Al vetar al conductor, no podrá tomar servicios y el bot ignorará sus interacciones.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Motivo del veto</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Describe el motivo del veto..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleBan}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar Veto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
