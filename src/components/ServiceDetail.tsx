import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, User, Building2, MessageSquare, AlertTriangle } from 'lucide-react';
import type { Service, Client, Driver } from '../App';

interface ServiceDetailProps {
  service: Service;
  client: Client;
  driver?: Driver;
  onBack: () => void;
  onTakeService: (serviceId: string, driverId: string) => { success: boolean; message: string };
}

export function ServiceDetail({ service, client, driver, onBack, onTakeService }: ServiceDetailProps) {
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('d1'); // Mock para demo

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'available':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'taken':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const getStatusLabel = () => {
    switch (service.status) {
      case 'available':
        return 'Disponible';
      case 'taken':
        return 'En Curso';
      case 'completed':
        return 'Completado';
    }
  };

  const handleTakeService = () => {
    const result = onTakeService(service.id, selectedDriverId);
    alert(result.message);
    if (result.success) {
      setShowTakeModal(false);
      onBack();
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Servicios
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Servicio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-gray-900">Detalles del Servicio</h1>
              <span className={`px-4 py-2 rounded-full border ${getStatusColor()}`}>
                {getStatusLabel()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-600 mb-1">Dirección</p>
                  <p className="text-gray-900">{service.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-600 mb-1">Hora Programada</p>
                  <p className="text-gray-900">{formatTime(service.time)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-600 mb-1">Cliente</p>
                  <p className="text-gray-900">{client.name}</p>
                  <p className="text-gray-600">{client.phone}</p>
                </div>
              </div>

              {driver && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-600 mb-1">Conductor Asignado</p>
                    <div className="flex items-center gap-3 mt-2">
                      <img
                        src={driver.photo}
                        alt={driver.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-gray-900">{driver.name}</p>
                        <p className="text-gray-600">{driver.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Flujo del Bot */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Flujo del ChatBot</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Anuncio del Servicio</p>
                  <p className="text-gray-600">
                    El servicio se anuncia en el grupo de WhatsApp con los detalles de dirección y hora.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Solicitud de Ubicación</p>
                  <p className="text-gray-600">
                    El bot solicita al conductor enviar su ubicación para poder tomar el servicio.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">3</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Verificación</p>
                  <p className="text-gray-600">
                    El bot verifica que el conductor esté activo, no vetado, y haya enviado la ubicación.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600">4</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">Confirmación</p>
                  <p className="text-gray-600">
                    Si todo está correcto, el servicio se asigna y se envía confirmación al grupo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna de Acciones */}
        <div className="space-y-6">
          {/* Acciones */}
          {service.status === 'available' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Acciones</h3>
              <button
                onClick={() => setShowTakeModal(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simular Toma de Servicio
              </button>
            </div>
          )}

          {/* Advertencias */}
          {service.status === 'available' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-900 mb-2">Servicio Disponible</p>
                  <p className="text-yellow-700">
                    Este servicio está esperando a ser tomado por un conductor activo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {driver?.isBanned && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 mb-2">Conductor Vetado</p>
                  <p className="text-red-700">
                    El conductor asignado está vetado. Esto es una situación anómala que debe revisarse.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Tomar Servicio */}
      {showTakeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">Tomar Servicio</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 mb-2">Flujo de Verificación:</p>
              <ul className="text-blue-700 space-y-1">
                <li>✓ Verificar estado del conductor (activo)</li>
                <li>✓ Verificar que no esté vetado</li>
                <li>✓ Solicitar ubicación actual</li>
                <li>✓ Asignar servicio si todo es correcto</li>
              </ul>
            </div>

            <p className="text-gray-600 mb-4">
              El bot verificará automáticamente si el conductor puede tomar el servicio según su estado y si está vetado.
            </p>

            <div className="space-y-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">Servicio</p>
                <p className="text-gray-900">{service.address}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-1">Cliente</p>
                <p className="text-gray-900">{client.name}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTakeModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleTakeService}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tomar Servicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
