import { useState } from 'react';
import { Search, Plus, CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react';
import type { Operator } from '../../App';
import { CreateOperatorModal } from '../molecules/CreateOperatorModal';

interface OperatorsListProps {
  operators: Operator[];
  onSelectOperator: (id: string) => void;
}

export function OperatorsList({ operators, onSelectOperator }: OperatorsListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Usuarios Operativos</h1>
        <p className="text-gray-600">Gestiona los operadores del sistema</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar operador..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Operador
          </button>
        </div>
      </div>

      {/* Lista de Operadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operators.map((operator) => (
          <div
            key={operator.id}
            onClick={() => onSelectOperator(operator.id)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1 truncate">{operator.name}</h3>
                {operator.isActive ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    <AlertCircle className="w-4 h-4" />
                    Inactivo
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="truncate">{operator.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{operator.phone}</span>
              </div>
            </div>

            {/* Settings Preview */}
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Nombre base grupo:</span>
                <span className="text-gray-900 truncate ml-2">{operator.settings.groupBaseName}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Máx. clientes/grupo:</span>
                <span className="text-gray-900">{operator.settings.maxClientsPerGroup}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal PrimeReact */}
      <CreateOperatorModal
        visible={showCreateModal}
        onHide={() => setShowCreateModal(false)}
      />
    </div>
  );
}
