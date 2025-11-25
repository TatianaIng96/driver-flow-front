import { useState } from 'react';
import { Search, Plus, Users, Ban, MapPin } from 'lucide-react';
import { AddMemberModal } from './AddMemberModal';
import type { Driver, Group } from '../App';

interface OperatorDriversListProps {
  drivers: Driver[];
  groups: Group[];
  onUpdateDriver: (id: string, updates: Partial<Driver>) => void;
  onBanDriver: (id: string, reason: string) => void;
  onAddDriver: (phone: string, name: string, document: string, photo?: string) => { success: boolean; message: string };
}

export function OperatorDriversList({ drivers, groups, onUpdateDriver, onBanDriver, onAddDriver }: OperatorDriversListProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusBadge = (status: Driver['status']) => {
    const badges = {
      active: { label: 'Activo', className: 'bg-green-100 text-green-700' },
      inactive: { label: 'Inactivo', className: 'bg-gray-100 text-gray-700' },
      vacation: { label: 'Vacaciones', className: 'bg-blue-100 text-blue-700' },
    };
    return badges[status];
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Mis Conductores</h1>
        <p className="text-gray-600">Gestiona todos tus conductores. Se agregan automáticamente a todos los grupos</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conductor por nombre o teléfono..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Conductor
          </button>
        </div>
      </div>

      {/* Lista de Conductores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => {
          const statusBadge = getStatusBadge(driver.status);
          const driverGroupsCount = groups.filter((g) => g.driverIds.includes(driver.id)).length;
          
          return (
            <div
              key={driver.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
            >
              {/* Header con foto y estado */}
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1 truncate">{driver.name}</h3>
                  <p className="text-gray-600 truncate">{driver.phone}</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
                {driver.isBanned && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                    <Ban className="w-4 h-4" />
                    Vetado
                  </span>
                )}
              </div>

              {/* Info adicional */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Documento:</span>
                  <span className="text-gray-900">{driver.document}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Grupos:</span>
                  <span className="text-gray-900">{driverGroupsCount}</span>
                </div>
                {driver.lastLocation && (
                  <div className="flex items-center gap-1 text-green-600">
                    <MapPin className="w-4 h-4" />
                    <span>Ubicación activa</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {drivers.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No hay conductores</h3>
            <p className="text-gray-600 mb-4">Agrega tu primer conductor para comenzar</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Conductor
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onAddDriver={(operatorId, phone, name, document, photo) => onAddDriver(phone, name, document, photo)}
          onAddClient={() => ({ success: false, message: '' })}
          operatorId=""
        />
      )}
    </div>
  );
}
