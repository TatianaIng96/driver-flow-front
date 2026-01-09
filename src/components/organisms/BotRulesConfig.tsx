import { Settings, Save, Users, Ban, Building2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { BotRules } from '../App';

interface BotRulesConfigProps {
  rules: BotRules;
  onUpdateRules: (rules: Partial<BotRules>) => void;
}

export function BotRulesConfig({ rules, onUpdateRules }: BotRulesConfigProps) {
  const [localRules, setLocalRules] = useState(rules);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof BotRules) => {
    setLocalRules({ ...localRules, [key]: !localRules[key] });
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateRules(localRules);
    setHasChanges(false);
    alert('Reglas actualizadas correctamente');
  };

  const handleReset = () => {
    setLocalRules(rules);
    setHasChanges(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Configuración de Reglas del Bot</h1>
        <p className="text-gray-600">
          Define cómo el bot de WhatsApp debe comportarse con conductores, clientes y servicios
        </p>
      </div>

      {/* Botones de Acción */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-blue-900">Tienes cambios sin guardar</p>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Estados y Servicios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900">Estados y Servicios</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Solo conductores activos pueden tomar servicios</h3>
                <p className="text-gray-600">
                  Los conductores inactivos o en vacaciones no podrán tomar servicios desde el bot.
                </p>
              </div>
              <button
                onClick={() => handleToggle('onlyActiveDriversCanTakeServices')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  localRules.onlyActiveDriversCanTakeServices ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    localRules.onlyActiveDriversCanTakeServices ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Números Vetados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ban className="w-5 h-5 text-red-600" />
            <h2 className="text-gray-900">Números Vetados</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Bloquear totalmente interacción de números vetados</h3>
                <p className="text-gray-600">
                  El bot ignorará completamente cualquier mensaje o interacción de números vetados.
                </p>
              </div>
              <button
                onClick={() => handleToggle('blockBannedInteraction')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  localRules.blockBannedInteraction ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    localRules.blockBannedInteraction ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Remover automáticamente de grupos al vetar</h3>
                <p className="text-gray-600">
                  Al vetar un número, será removido automáticamente de todos los grupos de WhatsApp.
                </p>
              </div>
              <button
                onClick={() => handleToggle('autoRemoveFromGroupsOnBan')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  localRules.autoRemoveFromGroupsOnBan ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    localRules.autoRemoveFromGroupsOnBan ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">
                  Permitir que sigan viendo el grupo pero sin tomar servicios
                </h3>
                <p className="text-gray-600">
                  Los números vetados pueden seguir en los grupos pero no podrán tomar servicios.
                </p>
              </div>
              <button
                onClick={() => handleToggle('allowBannedToViewGroups')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  localRules.allowBannedToViewGroups ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    localRules.allowBannedToViewGroups ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-gray-900">Clientes</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">No permitir que un cliente esté en más de un grupo</h3>
                <p className="text-gray-600">
                  Bloquea la asignación de clientes a múltiples grupos. Un cliente solo puede pertenecer a un
                  grupo.
                </p>
              </div>
              <button
                onClick={() => handleToggle('blockClientMultipleGroups')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  localRules.blockClientMultipleGroups ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    localRules.blockClientMultipleGroups ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Bloquear asignación de servicios a clientes vetados</h3>
                <p className="text-gray-600">
                  Los clientes vetados no podrán recibir servicios activos desde la plataforma.
                </p>
              </div>
              <button
                onClick={() => handleToggle('blockServicesForBannedClients')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  localRules.blockServicesForBannedClients ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    localRules.blockServicesForBannedClients ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Resumen de Configuración Actual */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-green-900">Configuración Actual</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  localRules.onlyActiveDriversCanTakeServices ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-green-800">
                {localRules.onlyActiveDriversCanTakeServices ? 'Solo activos toman servicios' : 'Todos pueden tomar servicios'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  localRules.blockBannedInteraction ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-green-800">
                {localRules.blockBannedInteraction ? 'Vetados bloqueados' : 'Vetados no bloqueados'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  localRules.autoRemoveFromGroupsOnBan ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-green-800">
                {localRules.autoRemoveFromGroupsOnBan ? 'Auto-remover al vetar' : 'No remover al vetar'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  localRules.blockClientMultipleGroups ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-green-800">
                {localRules.blockClientMultipleGroups ? 'Un cliente, un grupo' : 'Cliente en múltiples grupos'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
