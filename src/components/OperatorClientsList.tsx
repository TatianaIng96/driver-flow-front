import { useState } from 'react';
import { Search, Plus, Building2, Ban } from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';
import type { Client, Group } from '../App';

interface OperatorClientsListProps {
  clients: Client[];
  groups: Group[];
  onBanClient: (id: string, reason: string) => void;
  onAddClient: (phone: string, name: string) => { success: boolean; message: string };
}

export function OperatorClientsList({ clients, groups, onBanClient, onAddClient }: OperatorClientsListProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const getGroupName = (groupId: string | null) => {
    if (!groupId) return 'Sin grupo';
    const group = groups.find((g) => g.id === groupId);
    return group?.name || 'Grupo desconocido';
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Mis Clientes</h1>
        <p className="text-gray-600">Gestiona todos tus clientes. Se asignan automáticamente a grupos disponibles</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente por nombre o teléfono..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Cliente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 mb-1 truncate">{client.name}</h3>
                <p className="text-gray-600 truncate">{client.phone}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {client.isBanned && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">Vetado</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Grupo asignado:</span>
                <span className={`px-3 py-1 rounded-full ${
                  client.groupId
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {getGroupName(client.groupId)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {clients.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No hay clientes</h3>
            <p className="text-gray-600 mb-4">Agrega tu primer cliente. Se creará un grupo automáticamente</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Cliente
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAddDriver={() => ({ success: false, message: '' })}
          onAddClient={(operatorId, phone, name) => onAddClient(phone, name)}
          operatorId=""
        />
      )}
    </div>
  );
}
