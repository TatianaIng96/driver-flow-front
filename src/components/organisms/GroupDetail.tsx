import { useState } from 'react';
import { ArrowLeft, Users, Building2, Plus, X, Ban, AlertCircle } from 'lucide-react';
import type { Group, Driver, Client, BotRules } from '../App';

interface GroupDetailProps {
  group: Group;
  drivers: Driver[];
  clients: Client[];
  botRules: BotRules;
  onBack: () => void;
  onAddMember: (groupId: string, memberType: 'driver' | 'client', memberId: string) => void;
  onRemoveMember: (groupId: string, memberType: 'driver' | 'client', memberId: string) => void;
}

export function GroupDetail({
  group,
  drivers,
  clients,
  botRules,
  onBack,
  onAddMember,
  onRemoveMember,
}: GroupDetailProps) {
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const groupDrivers = drivers.filter((d) =>
    group.members.some((m) => m.type === 'driver' && m.id === d.id)
  );

  const groupClients = clients.filter((c) =>
    group.members.some((m) => m.type === 'client' && m.id === c.id)
  );

  const availableDrivers = drivers.filter(
    (d) => !group.members.some((m) => m.type === 'driver' && m.id === d.id)
  );

  const availableClients = clients.filter(
    (c) => !group.members.some((m) => m.type === 'client' && m.id === c.id)
  );

  const handleAddDriver = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) return;

    if (driver.isBanned) {
      alert('No puedes agregar un conductor vetado al grupo.');
      return;
    }

    onAddMember(group.id, 'driver', driverId);
    setShowAddDriverModal(false);
  };

  const handleAddClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    if (client.isBanned) {
      alert('No puedes agregar un cliente vetado al grupo.');
      return;
    }

    // Verificar si el cliente ya está en otro grupo
    if (botRules.blockClientMultipleGroups && client.groupId && client.groupId !== group.id) {
      const otherGroup = clients.find((c) => c.id === clientId);
      alert(`Este cliente ya pertenece a otro grupo, no puede estar en más de un grupo.`);
      return;
    }

    onAddMember(group.id, 'client', clientId);
    setShowAddClientModal(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Grupos
      </button>

      {/* Información del Grupo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-gray-900 mb-2">{group.name}</h1>
            <p className="text-gray-600">
              {group.type === 'operative'
                ? 'Grupo Operativo'
                : group.type === 'services'
                ? 'Grupo de Servicios'
                : 'Grupo General'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-900">{group.members.length}</p>
            <p className="text-gray-600">Total miembros</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conductores */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Conductores ({groupDrivers.length})</h2>
            </div>
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {groupDrivers.map((driver) => (
              <div
                key={driver.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group/item hover:bg-gray-100 transition-colors"
              >
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{driver.name}</p>
                  <p className="text-gray-600 truncate">{driver.phone}</p>
                </div>
                {driver.isBanned && (
                  <Ban className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <button
                  onClick={() => onRemoveMember(group.id, 'driver', driver.id)}
                  className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
            {groupDrivers.length === 0 && (
              <p className="text-gray-600 text-center py-8">No hay conductores en este grupo</p>
            )}
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Clientes ({groupClients.length})</h2>
            </div>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {groupClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group/item hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{client.name}</p>
                  <p className="text-gray-600 truncate">{client.phone}</p>
                </div>
                {client.isBanned && (
                  <Ban className="w-4 h-4 text-red-600 flex-shrink-0" />
                )}
                <button
                  onClick={() => onRemoveMember(group.id, 'client', client.id)}
                  className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
            {groupClients.length === 0 && (
              <p className="text-gray-600 text-center py-8">No hay clientes en este grupo</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Agregar Conductor */}
      {showAddDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-gray-900 mb-4">Agregar Conductor</h2>

            {availableDrivers.length > 0 ? (
              <div className="space-y-2">
                {availableDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => handleAddDriver(driver.id)}
                    disabled={driver.isBanned}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                      driver.isBanned
                        ? 'border-red-200 bg-red-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">{driver.name}</p>
                      <p className="text-gray-600">{driver.phone}</p>
                    </div>
                    {driver.isBanned && (
                      <div className="flex items-center gap-1 text-red-600">
                        <Ban className="w-4 h-4" />
                        <span>Vetado</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay conductores disponibles para agregar</p>
              </div>
            )}

            <button
              onClick={() => setShowAddDriverModal(false)}
              className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal Agregar Cliente */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-gray-900 mb-4">Agregar Cliente</h2>

            {availableClients.length > 0 ? (
              <div className="space-y-2">
                {availableClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleAddClient(client.id)}
                    disabled={client.isBanned}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                      client.isBanned
                        ? 'border-red-200 bg-red-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-purple-500 hover:bg-purple-50'
                    }`}
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{client.name}</p>
                      <p className="text-gray-600">{client.phone}</p>
                    </div>
                    {client.isBanned && (
                      <div className="flex items-center gap-1 text-red-600">
                        <Ban className="w-4 h-4" />
                        <span>Vetado</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay clientes disponibles para agregar</p>
              </div>
            )}

            <button
              onClick={() => setShowAddClientModal(false)}
              className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
