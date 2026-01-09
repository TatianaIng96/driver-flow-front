import { Search, Plus, MessageSquare, Users } from 'lucide-react';
import type { Group } from '../App';

interface GroupsListProps {
  groups: Group[];
  onSelectGroup: (id: string) => void;
}

export function GroupsList({ groups, onSelectGroup }: GroupsListProps) {
  const getTypeLabel = (type: Group['type']) => {
    const types = {
      operative: { label: 'Operativo', className: 'bg-blue-100 text-blue-700' },
      services: { label: 'Servicios', className: 'bg-green-100 text-green-700' },
      general: { label: 'General', className: 'bg-purple-100 text-purple-700' },
    };
    return types[type];
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Grupos de WhatsApp</h1>
        <p className="text-gray-600">Gestiona los grupos y sus miembros</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar grupo..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Nuevo Grupo
          </button>
        </div>
      </div>

      {/* Lista de Grupos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const typeInfo = getTypeLabel(group.type);
          const driversCount = group.members.filter((m) => m.type === 'driver').length;
          const clientsCount = group.members.filter((m) => m.type === 'client').length;
          
          return (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <MessageSquare className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1 truncate">{group.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full ${typeInfo.className}`}>
                    {typeInfo.label}
                  </span>
                </div>
              </div>

              {/* Miembros */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Total miembros</span>
                  </div>
                  <span className="text-gray-900">{group.members.length}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Conductores</span>
                  <span className="text-gray-900">{driversCount}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Clientes</span>
                  <span className="text-gray-900">{clientsCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
