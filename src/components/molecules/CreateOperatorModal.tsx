import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useCreateUserMutation } from '../../services/users';
import { toast } from 'sonner';

interface CreateOperatorModalProps {
  visible: boolean;
  onHide: () => void;
}

export function CreateOperatorModal({ visible, onHide }: CreateOperatorModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    documentNumber: '',
    typeDocument: 'CC',
    role: 'operator',
    active: 1
  });

  const documentTypes = [
    { label: 'Cédula de Ciudadanía', value: 'CC' },
    { label: 'Cédula de Extranjería', value: 'CE' },
    { label: 'NIT', value: 'NIT' },
    { label: 'Pasaporte', value: 'PASSPORT' }
  ];

  const handleCreate = async () => {
    // Validar campos requeridos
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim() ||
        !formData.password.trim() || !formData.documentNumber.trim()) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    try {
      await createUser(formData).unwrap();
      toast.success('Operador creado exitosamente');
      onHide();
      // Resetear formulario
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        documentNumber: '',
        typeDocument: 'CC',
        role: 'operator',
        active: 1
      });
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Error al crear el operador';
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      documentNumber: '',
      typeDocument: 'CC',
      role: 'operator',
      active: 1
    });
    onHide();
  };

  const footer = (
    <div className="flex gap-3 justify-end">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleCancel}
        disabled={isLoading}
        className="p-button-text"
      />
      <Button
        label={isLoading ? 'Creando...' : 'Crear Operador'}
        icon="pi pi-check"
        onClick={handleCreate}
        disabled={isLoading}
        loading={isLoading}
      />
    </div>
  );

  return (
    <Dialog
      header="Crear Nuevo Operador"
      visible={visible}
      style={{ width: '500px' }}
      onHide={handleCancel}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="font-semibold">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <InputText
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Ej: Juan Pérez"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <InputText
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contacto@empresa.com"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="phoneNumber" className="font-semibold">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <InputText
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="+57 300 123 4567"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <Password
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
            toggleMask
            feedback={false}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="typeDocument" className="font-semibold">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <Dropdown
              id="typeDocument"
              value={formData.typeDocument}
              options={documentTypes}
              onChange={(e) => handleInputChange('typeDocument', e.value)}
              placeholder="Seleccione"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="documentNumber" className="font-semibold">
              Número de Documento <span className="text-red-500">*</span>
            </label>
            <InputText
              id="documentNumber"
              value={formData.documentNumber}
              onChange={(e) => handleInputChange('documentNumber', e.target.value)}
              placeholder="123456789"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
