import { MessageSquare, Users, Building2 } from 'lucide-react';
import type { Group, Driver, Client } from '../App';

interface OperatorGroupsListProps {
  groups: Group[];
  drivers: Driver[];
  clients: Client[];
  onSelectGroup: (id: string) => void;
}

export function OperatorGroupsList({ groups, drivers, clients, onSelectGroup }: OperatorGroupsListProps) {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Mis Grupos de WhatsApp</h1>
        <p className="text-gray-600">Grupos creados automáticamente al agregar clientes</p>
      </div>

      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const groupDrivers = drivers.filter((d) => group.driverIds.includes(d.id)).length;
            const groupClients = clients.filter((c) => group.clientIds.includes(c.id)).length;
            const maxClients = 30; // Desde settings
            const occupancy = (groupClients / maxClients) * 100;
            
            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={group.photo}
                    alt={group.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-500 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1 truncate">{group.name}</h3>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Grupo {group.sequenceNumber}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Ocupación</span>
                    <span className="text-gray-900">{groupClients}/{maxClients} clientes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        occupancy >= 90 ? 'bg-red-500' : occupancy >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Total miembros</span>
                    </div>
                    <span className="text-gray-900">{group.driverIds.length + group.clientIds.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Conductores</span>
                    <span className="text-gray-900">{groupDrivers}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Clientes</span>
                    <span className="text-gray-900">{groupClients}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No hay grupos creados</h3>
          <p className="text-gray-600 mb-4">
            Los grupos se crean automáticamente cuando agregas clientes
          </p>
          <p className="text-gray-500">
            Agrega tu primer cliente para que el sistema cree el primer grupo
          </p>
        </div>
      )}
    </div>
  );
}
