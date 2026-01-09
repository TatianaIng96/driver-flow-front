import { useState } from 'react';
import { Save, Settings as SettingsIcon, Image, Hash, Users } from 'lucide-react';
import type { Operator, OperatorSettings as OperatorSettingsType } from '../App';

interface OperatorSettingsProps {
  operator: Operator;
  onUpdateSettings: (operatorId: string, settings: Partial<OperatorSettingsType>) => void;
}

export function OperatorSettings({ operator, onUpdateSettings }: OperatorSettingsProps) {
  const [settings, setSettings] = useState(operator.settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof OperatorSettingsType, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleToggle = (field: keyof typeof settings.botRules) => {
    setSettings({
      ...settings,
      botRules: { ...settings.botRules, [field]: !settings.botRules[field] },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateSettings(operator.id, settings);
    setHasChanges(false);
    alert('Configuración guardada exitosamente');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">Personaliza tu operación y las reglas del bot</p>
      </div>

      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-blue-900">Tienes cambios sin guardar</p>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Configuración de Grupos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-gray-900">Configuración de Grupos</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Nombre Base de Grupos
              </label>
              <input
                type="text"
                value={settings.groupBaseName}
                onChange={(e) => handleChange('groupBaseName', e.target.value)}
                placeholder="Ej: Servicios, Operativo, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 mt-1">Los grupos se nombrarán como: {settings.groupBaseName}_1, {settings.groupBaseName}_2, etc.</p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Image className="w-4 h-4 inline mr-1" />
                URL de Foto del Grupo
              </label>
              <input
                type="url"
                value={settings.groupPhoto}
                onChange={(e) => handleChange('groupPhoto', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {settings.groupPhoto && (
                <img src={settings.groupPhoto} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover" />
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Máximo de Clientes por Grupo
              </label>
              <input
                type="number"
                value={settings.maxClientsPerGroup}
                onChange={(e) => handleChange('maxClientsPerGroup', parseInt(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 mt-1">Cuando se alcance este límite, se creará un nuevo grupo automáticamente</p>
            </div>
          </div>
        </div>

        {/* Reglas del Bot */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Reglas del Bot</h2>

          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Solo conductores activos toman servicios</h3>
                <p className="text-gray-600">Los conductores inactivos o en vacaciones no podrán tomar servicios</p>
              </div>
              <button
                onClick={() => handleToggle('onlyActiveDriversCanTakeServices')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  settings.botRules.onlyActiveDriversCanTakeServices ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.botRules.onlyActiveDriversCanTakeServices ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Bloquear interacción de números vetados</h3>
                <p className="text-gray-600">El bot ignorará completamente mensajes de números vetados</p>
              </div>
              <button
                onClick={() => handleToggle('blockBannedInteraction')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  settings.botRules.blockBannedInteraction ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.botRules.blockBannedInteraction ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Remover automáticamente de grupos al vetar</h3>
                <p className="text-gray-600">Al vetar, se removerá del WhatsApp automáticamente</p>
              </div>
              <button
                onClick={() => handleToggle('autoRemoveFromGroupsOnBan')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  settings.botRules.autoRemoveFromGroupsOnBan ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.botRules.autoRemoveFromGroupsOnBan ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Bloquear servicios para clientes vetados</h3>
                <p className="text-gray-600">Los clientes vetados no recibirán servicios</p>
              </div>
              <button
                onClick={() => handleToggle('blockServicesForBannedClients')}
                className={`flex-shrink-0 ml-4 relative w-14 h-8 rounded-full transition-colors ${
                  settings.botRules.blockServicesForBannedClients ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.botRules.blockServicesForBannedClients ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
