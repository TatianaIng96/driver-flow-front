import { useState } from 'react';
import { ArrowLeft, Building2, MessageSquare, Ban, AlertTriangle } from 'lucide-react';
import type { Client, Group } from '../App';

interface ClientDetailProps {
  client: Client;
  groups: Group[];
  onBack: () => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onBanClient: (id: string, reason: string) => void;
}

export function ClientDetail({ client, groups, onBack, onUpdateClient, onBanClient }: ClientDetailProps) {
  const [showBanModal, setShowBanModal] = useState(false);
  const [showChangeGroupModal, setShowChangeGroupModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(client.groupId);

  const currentGroup = groups.find((g) => g.id === client.groupId);

  const handleBan = () => {
    if (!banReason.trim()) {
      alert('Debes ingresar un motivo para vetar al cliente');
      return;
    }
    onBanClient(client.id, banReason);
    setShowBanModal(false);
    alert('Cliente vetado correctamente');
    onBack();
  };

  const handleChangeGroup = () => {
    if (selectedGroupId === client.groupId) {
      setShowChangeGroupModal(false);
      return;
    }

    // Verificar si el cliente ya está en otro grupo
    const clientInAnotherGroup = groups.some(
      (g) => g.id !== selectedGroupId && g.members.some((m) => m.type === 'client' && m.id === client.id)
    );

    if (clientInAnotherGroup) {
      alert(`Este cliente ya pertenece al grupo ${currentGroup?.name}, no puede estar en más de un grupo.`);
      return;
    }

    onUpdateClient(client.id, { groupId: selectedGroupId });
    alert('Grupo actualizado correctamente');
    setShowChangeGroupModal(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Clientes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Información del Cliente</h2>
            
            <div className="flex items-start gap-6 mb-6">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-12 h-12 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">{client.name}</h3>
                <div className="space-y-2">
                  <div className="flex gap-2 text-gray-600">
                    <span>Teléfono:</span>
                    <span className="text-gray-900">{client.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grupo de WhatsApp */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-gray-900">Grupo de WhatsApp</h2>
              </div>
              {!client.isBanned && (
                <button
                  onClick={() => setShowChangeGroupModal(true)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Cambiar Grupo
                </button>
              )}
            </div>
            
            {currentGroup ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 mb-1">{currentGroup.name}</p>
                <p className="text-gray-600">
                  {currentGroup.type === 'operative'
                    ? 'Operativo'
                    : currentGroup.type === 'services'
                    ? 'Servicios'
                    : 'General'}
                </p>
                <p className="text-gray-600 mt-2">{currentGroup.members.length} miembros</p>
              </div>
            ) : (
              <p className="text-gray-600">No asignado a ningún grupo</p>
            )}

            {client.isBanned && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">
                  El cliente está vetado y no puede ser asignado a ningún grupo.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Columna de Acciones */}
        <div className="space-y-6">
          {/* Estado del Cliente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Estado del Cliente</h3>
            <div className="space-y-3">
              {client.isBanned && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
                  <Ban className="w-5 h-5" />
                  <span>Cliente Vetado</span>
                </div>
              )}
              {!client.isBanned && (
                <div className="p-3 bg-green-50 rounded-lg text-green-700">
                  Estado: Activo
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-gray-900 mb-4">Acciones</h3>
            <div className="space-y-3">
              {!client.isBanned && (
                <button
                  onClick={() => setShowBanModal(true)}
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Vetar Cliente
                </button>
              )}
            </div>
          </div>

          {/* Advertencias */}
          {client.isBanned && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 mb-2">Cliente Vetado</p>
                  <ul className="text-red-700 space-y-1">
                    <li>• No puede ser agregado a grupos</li>
                    <li>• No puede recibir servicios activos</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Cambio de Grupo */}
      {showChangeGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-gray-900 mb-4">Cambiar Grupo</h2>
            
            <p className="text-gray-600 mb-4">
              Selecciona el nuevo grupo para el cliente. Recuerda que un cliente solo puede estar en un grupo.
            </p>

            <div className="space-y-2 mb-4">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedGroupId === group.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-gray-900">{group.name}</p>
                  <p className="text-gray-600">
                    {group.type === 'operative'
                      ? 'Operativo'
                      : group.type === 'services'
                      ? 'Servicios'
                      : 'General'}
                  </p>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowChangeGroupModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangeGroup}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar Cambio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Veto */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-6 h-6 text-red-600" />
              <h2 className="text-gray-900">Vetar Cliente</h2>
            </div>
            
            <p className="text-gray-600 mb-4">
              Al vetar al cliente, no podrá ser agregado a ningún grupo y no podrá recibir servicios activos.
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
