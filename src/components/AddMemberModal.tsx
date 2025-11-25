import { useState } from 'react';
import { Users, Building2, Phone, User, FileText, X } from 'lucide-react';

interface AddMemberModalProps {
  onClose: () => void;
  onAddDriver: (operatorId: string, phone: string, name: string, document: string, photo?: string) => { success: boolean; message: string };
  onAddClient: (operatorId: string, phone: string, name: string) => { success: boolean; message: string };
  operatorId: string;
}

export function AddMemberModal({ onClose, onAddDriver, onAddClient, operatorId }: AddMemberModalProps) {
  const [memberType, setMemberType] = useState<'driver' | 'client'>('driver');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [photo, setPhoto] = useState('');

  const handleSubmit = () => {
    if (!phone.trim() || !name.trim()) {
      alert('Teléfono y nombre son obligatorios');
      return;
    }

    let result;
    if (memberType === 'driver') {
      if (!document.trim()) {
        alert('El documento es obligatorio para conductores');
        return;
      }
      result = onAddDriver(operatorId, phone, name, document, photo);
    } else {
      result = onAddClient(operatorId, phone, name);
    }

    alert(result.message);
    
    if (result.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Agregar Miembro</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Selector de Tipo */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMemberType('driver')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              memberType === 'driver'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className={`w-6 h-6 mx-auto mb-2 ${memberType === 'driver' ? 'text-blue-600' : 'text-gray-400'}`} />
            <p className={memberType === 'driver' ? 'text-blue-900' : 'text-gray-900'}>Conductor</p>
            <p className={`${memberType === 'driver' ? 'text-blue-700' : 'text-gray-600'}`}>
              Se agrega a todos los grupos
            </p>
          </button>

          <button
            onClick={() => setMemberType('client')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              memberType === 'client'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Building2 className={`w-6 h-6 mx-auto mb-2 ${memberType === 'client' ? 'text-purple-600' : 'text-gray-400'}`} />
            <p className={memberType === 'client' ? 'text-purple-900' : 'text-gray-900'}>Cliente</p>
            <p className={`${memberType === 'client' ? 'text-purple-700' : 'text-gray-600'}`}>
              Solo puede estar en un grupo
            </p>
          </button>
        </div>

        {/* Formulario */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Número de WhatsApp *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nombre Completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={memberType === 'driver' ? 'Juan Pérez' : 'Empresa ABC S.A.S'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {memberType === 'driver' && (
            <>
              <div>
                <label className="block text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Documento de Identidad *
                </label>
                <input
                  type="text"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  URL de Foto (opcional)
                </label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className={`p-4 rounded-lg mb-6 ${memberType === 'driver' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'}`}>
          <p className={`${memberType === 'driver' ? 'text-blue-900' : 'text-purple-900'} mb-2`}>
            {memberType === 'driver' ? '📱 Conductor' : '🏢 Cliente'}
          </p>
          <ul className={`${memberType === 'driver' ? 'text-blue-700' : 'text-purple-700'} space-y-1`}>
            {memberType === 'driver' ? (
              <>
                <li>✓ Se agregará automáticamente a todos los grupos existentes</li>
                <li>✓ Si se crean nuevos grupos, se agregará a esos también</li>
              </>
            ) : (
              <>
                <li>✓ Se buscará un grupo con espacio disponible</li>
                <li>✓ Si todos están llenos, se creará un nuevo grupo automáticamente</li>
                <li>✓ Solo puede estar en un grupo a la vez</li>
              </>
            )}
          </ul>
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-2 text-white rounded-lg transition-colors ${
              memberType === 'driver'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Agregar {memberType === 'driver' ? 'Conductor' : 'Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}
