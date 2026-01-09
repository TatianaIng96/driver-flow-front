import { ArrowLeft, Users, Building2, X } from 'lucide-react';
import type { Group, Driver, Client } from '../App';

interface OperatorGroupDetailProps {
  group: Group;
  drivers: Driver[];
  clients: Client[];
  onBack: () => void;
  onRemoveDriver: (groupId: string, driverId: string) => void;
  onRemoveClient: (groupId: string, clientId: string) => void;
}

export function OperatorGroupDetail({ group, drivers, clients, onBack, onRemoveDriver, onRemoveClient }: OperatorGroupDetailProps) {
  const groupDrivers = drivers.filter((d) => group.driverIds.includes(d.id));
  const groupClients = clients.filter((c) => group.clientIds.includes(c.id));

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Volver a Grupos
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <img src={group.photo} alt={group.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200" />
          <div>
            <h1 className="text-gray-900 mb-1">{group.name}</h1>
            <p className="text-gray-600">Grupo {group.sequenceNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-gray-900">Conductores ({groupDrivers.length})</h2>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {groupDrivers.map((driver) => (
              <div key={driver.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group/item hover:bg-gray-100 transition-colors">
                <img src={driver.photo} alt={driver.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{driver.name}</p>
                  <p className="text-gray-600 truncate">{driver.phone}</p>
                </div>
                <button
                  onClick={() => onRemoveDriver(group.id, driver.id)}
                  className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
            {groupDrivers.length === 0 && <p className="text-gray-600 text-center py-8">No hay conductores</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <h2 className="text-gray-900">Clientes ({groupClients.length})</h2>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {groupClients.map((client) => (
              <div key={client.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group/item hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{client.name}</p>
                  <p className="text-gray-600 truncate">{client.phone}</p>
                </div>
                <button
                  onClick={() => onRemoveClient(group.id, client.id)}
                  className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
            {groupClients.length === 0 && <p className="text-gray-600 text-center py-8">No hay clientes</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
