import { useState } from 'react';
import { Login } from './components/Login';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { OperatorDashboard } from './components/OperatorDashboard';
import { OperatorsList } from './components/OperatorsList';
import { OperatorDetail } from './components/OperatorDetail';
import { OperatorDriversList } from './components/OperatorDriversList';
import { OperatorClientsList } from './components/OperatorClientsList';
import { OperatorGroupsList } from './components/OperatorGroupsList';
import { OperatorGroupDetail } from './components/OperatorGroupDetail';
import { OperatorSettings } from './components/OperatorSettings';
import { AddMemberModal } from './components/AddMemberModal';
import { WhatsAppConnection } from './components/WhatsAppConnection';
import { SuperAdminSidebar } from './components/SuperAdminSidebar';
import { OperatorSidebar } from './components/OperatorSidebar';
import { mockOperators } from './data/mockData';

export type UserRole = 'super_admin' | 'operator';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  operatorId?: string;
};

export type Operator = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  isActive: boolean;
  settings: OperatorSettings;
  whatsappConnection?: WhatsAppConnection;
};

export type WhatsAppConnection = {
  isConnected: boolean;
  connectedAt?: string;
  phoneNumber?: string;
  profileName?: string;
  qrCode?: string;
  status: 'disconnected' | 'qr_ready' | 'connecting' | 'connected';
};

export type OperatorSettings = {
  groupBaseName: string;
  groupPhoto: string;
  maxClientsPerGroup: number;
  botRules: BotRules;
};

export type BotRules = {
  onlyActiveDriversCanTakeServices: boolean;
  blockBannedInteraction: boolean;
  autoRemoveFromGroupsOnBan: boolean;
  blockServicesForBannedClients: boolean;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  photo: string;
  document: string;
  status: 'active' | 'inactive' | 'vacation';
  isBanned: boolean;
  operatorId: string;
  lastLocation?: { lat: number; lng: number };
  addedAt: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  groupId: string | null;
  isBanned: boolean;
  operatorId: string;
  addedAt: string;
};

export type Group = {
  id: string;
  name: string;
  operatorId: string;
  sequenceNumber: number;
  photo: string;
  driverIds: string[];
  clientIds: string[];
  createdAt: string;
};

export type BannedNumber = {
  id: string;
  phone: string;
  type: 'driver' | 'client';
  name: string;
  reason: string;
  date: string;
  entityId: string;
  operatorId: string;
};

export type AppState = {
  operators: Operator[];
  drivers: Driver[];
  clients: Client[];
  groups: Group[];
  bannedNumbers: BannedNumber[];
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const [appState, setAppState] = useState<AppState>({
    operators: mockOperators,
    drivers: [],
    clients: [],
    groups: [],
    bannedNumbers: [],
  });

  if (!isLoggedIn || !currentUser) {
    return (
      <Login
        onLogin={(user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  const navigate = (view: string, id?: string) => {
    setCurrentView(view);
    if (view === 'operator-detail' && id) setSelectedOperatorId(id);
  };

  // Función para agregar conductor
  const addDriver = (operatorId: string, phone: string, name: string, document: string, photo?: string) => {
    // Verificar si el número ya existe
    const existingDriver = appState.drivers.find((d) => d.phone === phone);
    if (existingDriver) {
      return { success: false, message: 'Este número ya está registrado como conductor' };
    }

    const existingClient = appState.clients.find((c) => c.phone === phone);
    if (existingClient) {
      return { success: false, message: 'Este número ya está registrado como cliente' };
    }

    // Crear nuevo conductor
    const newDriver: Driver = {
      id: `d-${Date.now()}`,
      name,
      phone,
      photo: photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      document,
      status: 'active',
      isBanned: false,
      operatorId,
      addedAt: new Date().toISOString(),
    };

    // Agregar conductor a TODOS los grupos del operador
    const operatorGroups = appState.groups.filter((g) => g.operatorId === operatorId);
    const updatedGroups = appState.groups.map((group) =>
      operatorGroups.find((g) => g.id === group.id)
        ? { ...group, driverIds: [...group.driverIds, newDriver.id] }
        : group
    );

    setAppState((prev) => ({
      ...prev,
      drivers: [...prev.drivers, newDriver],
      groups: updatedGroups,
    }));

    return { success: true, message: 'Conductor agregado exitosamente a todos los grupos' };
  };

  // Función para agregar cliente
  const addClient = (operatorId: string, phone: string, name: string) => {
    // Verificar si el número ya existe
    const existingClient = appState.clients.find((c) => c.phone === phone);
    if (existingClient) {
      const group = appState.groups.find((g) => g.id === existingClient.groupId);
      return {
        success: false,
        message: `Este número ya existe en el grupo ${group?.name || 'desconocido'}`,
      };
    }

    const existingDriver = appState.drivers.find((d) => d.phone === phone);
    if (existingDriver) {
      return { success: false, message: 'Este número ya está registrado como conductor' };
    }

    // Crear nuevo cliente
    const newClient: Client = {
      id: `c-${Date.now()}`,
      name,
      phone,
      groupId: null,
      isBanned: false,
      operatorId,
      addedAt: new Date().toISOString(),
    };

    // Buscar grupo con espacio disponible
    const operator = appState.operators.find((o) => o.id === operatorId);
    if (!operator) {
      return { success: false, message: 'Operador no encontrado' };
    }

    const maxClients = operator.settings.maxClientsPerGroup;
    const operatorGroups = appState.groups.filter((g) => g.operatorId === operatorId);

    // Buscar grupo con espacio
    let targetGroup = operatorGroups.find((g) => g.clientIds.length < maxClients);

    // Si no hay grupo con espacio, crear uno nuevo
    if (!targetGroup) {
      const nextSequence = operatorGroups.length + 1;
      const newGroup: Group = {
        id: `g-${Date.now()}`,
        name: `${operator.settings.groupBaseName}_${nextSequence}`,
        operatorId,
        sequenceNumber: nextSequence,
        photo: operator.settings.groupPhoto,
        driverIds: appState.drivers.filter((d) => d.operatorId === operatorId).map((d) => d.id),
        clientIds: [newClient.id],
        createdAt: new Date().toISOString(),
      };

      newClient.groupId = newGroup.id;

      setAppState((prev) => ({
        ...prev,
        clients: [...prev.clients, newClient],
        groups: [...prev.groups, newGroup],
      }));

      return {
        success: true,
        message: `Cliente agregado. Se creó el grupo ${newGroup.name} automáticamente`,
      };
    }

    // Agregar cliente al grupo existente
    newClient.groupId = targetGroup.id;

    setAppState((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
      groups: prev.groups.map((g) =>
        g.id === targetGroup!.id ? { ...g, clientIds: [...g.clientIds, newClient.id] } : g
      ),
    }));

    return { success: true, message: `Cliente agregado al grupo ${targetGroup.name}` };
  };

  // Función para actualizar conductor
  const updateDriver = (id: string, updates: Partial<Driver>) => {
    setAppState((prev) => ({
      ...prev,
      drivers: prev.drivers.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  };

  // Función para vetar conductor
  const banDriver = (id: string, reason: string) => {
    const driver = appState.drivers.find((d) => d.id === id);
    if (!driver) return;

    const bannedNumber: BannedNumber = {
      id: `ban-${Date.now()}`,
      phone: driver.phone,
      type: 'driver',
      name: driver.name,
      reason,
      date: new Date().toISOString(),
      entityId: id,
      operatorId: driver.operatorId,
    };

    const operator = appState.operators.find((o) => o.id === driver.operatorId);
    const shouldRemoveFromGroups = operator?.settings.botRules.autoRemoveFromGroupsOnBan;

    setAppState((prev) => ({
      ...prev,
      drivers: prev.drivers.map((d) => (d.id === id ? { ...d, isBanned: true } : d)),
      bannedNumbers: [...prev.bannedNumbers, bannedNumber],
      groups: shouldRemoveFromGroups
        ? prev.groups.map((g) => ({
            ...g,
            driverIds: g.driverIds.filter((dId) => dId !== id),
          }))
        : prev.groups,
    }));
  };

  // Función para vetar cliente
  const banClient = (id: string, reason: string) => {
    const client = appState.clients.find((c) => c.id === id);
    if (!client) return;

    const bannedNumber: BannedNumber = {
      id: `ban-${Date.now()}`,
      phone: client.phone,
      type: 'client',
      name: client.name,
      reason,
      date: new Date().toISOString(),
      entityId: id,
      operatorId: client.operatorId,
    };

    const operator = appState.operators.find((o) => o.id === client.operatorId);
    const shouldRemoveFromGroups = operator?.settings.botRules.autoRemoveFromGroupsOnBan;

    setAppState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === id ? { ...c, isBanned: true, groupId: null } : c)),
      bannedNumbers: [...prev.bannedNumbers, bannedNumber],
      groups: shouldRemoveFromGroups
        ? prev.groups.map((g) => ({
            ...g,
            clientIds: g.clientIds.filter((cId) => cId !== id),
          }))
        : prev.groups,
    }));
  };

  // Función para levantar veto
  const unbanNumber = (bannedId: string) => {
    const banned = appState.bannedNumbers.find((b) => b.id === bannedId);
    if (!banned) return;

    setAppState((prev) => ({
      ...prev,
      drivers:
        banned.type === 'driver'
          ? prev.drivers.map((d) => (d.id === banned.entityId ? { ...d, isBanned: false } : d))
          : prev.drivers,
      clients:
        banned.type === 'client'
          ? prev.clients.map((c) => (c.id === banned.entityId ? { ...c, isBanned: false } : c))
          : prev.clients,
      bannedNumbers: prev.bannedNumbers.filter((b) => b.id !== bannedId),
    }));
  };

  // Función para actualizar configuración de operador
  const updateOperatorSettings = (operatorId: string, settings: Partial<OperatorSettings>) => {
    setAppState((prev) => ({
      ...prev,
      operators: prev.operators.map((o) =>
        o.id === operatorId ? { ...o, settings: { ...o.settings, ...settings } } : o
      ),
    }));
  };

  // Función para crear operador (solo super admin)
  const createOperator = (name: string, email: string, phone: string) => {
    const newOperator: Operator = {
      id: `op-${Date.now()}`,
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
      isActive: true,
      settings: {
        groupBaseName: 'Grupo',
        groupPhoto: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop',
        maxClientsPerGroup: 30,
        botRules: {
          onlyActiveDriversCanTakeServices: true,
          blockBannedInteraction: true,
          autoRemoveFromGroupsOnBan: true,
          blockServicesForBannedClients: true,
        },
      },
    };

    setAppState((prev) => ({
      ...prev,
      operators: [...prev.operators, newOperator],
    }));

    return { success: true, message: 'Operador creado exitosamente' };
  };

  // Función para eliminar conductor de grupo
  const removeDriverFromGroup = (groupId: string, driverId: string) => {
    setAppState((prev) => ({
      ...prev,
      groups: prev.groups.map((g) =>
        g.id === groupId ? { ...g, driverIds: g.driverIds.filter((id) => id !== driverId) } : g
      ),
    }));
  };

  // Función para eliminar cliente de grupo
  const removeClientFromGroup = (groupId: string, clientId: string) => {
    setAppState((prev) => ({
      ...prev,
      clients: prev.clients.map((c) => (c.id === clientId ? { ...c, groupId: null } : c)),
      groups: prev.groups.map((g) =>
        g.id === groupId ? { ...g, clientIds: g.clientIds.filter((id) => id !== clientId) } : g
      ),
    }));
  };

  // Función para actualizar conexión WhatsApp
  const updateWhatsAppConnection = (operatorId: string, connection: WhatsAppConnection) => {
    setAppState((prev) => ({
      ...prev,
      operators: prev.operators.map((o) =>
        o.id === operatorId ? { ...o, whatsappConnection: connection } : o
      ),
    }));
  };

  const currentOperatorId = currentUser.role === 'operator' ? currentUser.operatorId : selectedOperatorId;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {currentUser.role === 'super_admin' ? (
        <SuperAdminSidebar currentView={currentView} onNavigate={navigate} />
      ) : (
        <OperatorSidebar currentView={currentView} onNavigate={navigate} userName={currentUser.name} />
      )}

      <div className="flex-1 overflow-auto">
        {/* Super Admin Views */}
        {currentUser.role === 'super_admin' && currentView === 'dashboard' && (
          <SuperAdminDashboard appState={appState} onNavigate={navigate} />
        )}
        {currentUser.role === 'super_admin' && currentView === 'operators' && (
          <OperatorsList operators={appState.operators} onSelectOperator={(id) => navigate('operator-detail', id)} onCreateOperator={createOperator} />
        )}
        {currentUser.role === 'super_admin' && currentView === 'operator-detail' && selectedOperatorId && (
          <OperatorDetail
            operator={appState.operators.find((o) => o.id === selectedOperatorId)!}
            drivers={appState.drivers.filter((d) => d.operatorId === selectedOperatorId)}
            clients={appState.clients.filter((c) => c.operatorId === selectedOperatorId)}
            groups={appState.groups.filter((g) => g.operatorId === selectedOperatorId)}
            onBack={() => navigate('operators')}
            onUpdateSettings={updateOperatorSettings}
          />
        )}

        {/* Operator Views */}
        {currentUser.role === 'operator' && currentView === 'dashboard' && currentOperatorId && (
          <OperatorDashboard
            operator={appState.operators.find((o) => o.id === currentOperatorId)!}
            drivers={appState.drivers.filter((d) => d.operatorId === currentOperatorId)}
            clients={appState.clients.filter((c) => c.operatorId === currentOperatorId)}
            groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
            bannedNumbers={appState.bannedNumbers.filter((b) => b.operatorId === currentOperatorId)}
          />
        )}
        {currentUser.role === 'operator' && currentView === 'whatsapp' && currentOperatorId && (
          <WhatsAppConnection
            operator={appState.operators.find((o) => o.id === currentOperatorId)!}
            onUpdateConnection={updateWhatsAppConnection}
          />
        )}
        {currentUser.role === 'operator' && currentView === 'drivers' && currentOperatorId && (
          <OperatorDriversList
            drivers={appState.drivers.filter((d) => d.operatorId === currentOperatorId)}
            groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
            onUpdateDriver={updateDriver}
            onBanDriver={banDriver}
            onAddDriver={(phone, name, document, photo) => addDriver(currentOperatorId, phone, name, document, photo)}
          />
        )}
        {currentUser.role === 'operator' && currentView === 'clients' && currentOperatorId && (
          <OperatorClientsList
            clients={appState.clients.filter((c) => c.operatorId === currentOperatorId)}
            groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
            onBanClient={banClient}
            onAddClient={(phone, name) => addClient(currentOperatorId, phone, name)}
          />
        )}
        {currentUser.role === 'operator' && currentView === 'groups' && currentOperatorId && (
          <OperatorGroupsList
            groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
            drivers={appState.drivers.filter((d) => d.operatorId === currentOperatorId)}
            clients={appState.clients.filter((c) => c.operatorId === currentOperatorId)}
            onSelectGroup={(id) => navigate('group-detail', id)}
          />
        )}
        {currentUser.role === 'operator' && currentView === 'group-detail' && selectedOperatorId && (
          <OperatorGroupDetail
            group={appState.groups.find((g) => g.id === selectedOperatorId)!}
            drivers={appState.drivers}
            clients={appState.clients}
            onBack={() => navigate('groups')}
            onRemoveDriver={removeDriverFromGroup}
            onRemoveClient={removeClientFromGroup}
          />
        )}
        {currentUser.role === 'operator' && currentView === 'banned' && currentOperatorId && (
          <div className="p-6 md:p-8">
            <h1 className="text-gray-900 mb-2">Números Vetados</h1>
            <p className="text-gray-600 mb-6">Gestión de conductores y clientes vetados</p>
            {/* Componente de números vetados aquí */}
          </div>
        )}
        {currentUser.role === 'operator' && currentView === 'settings' && currentOperatorId && (
          <OperatorSettings
            operator={appState.operators.find((o) => o.id === currentOperatorId)!}
            onUpdateSettings={updateOperatorSettings}
          />
        )}
      </div>

      {/* Modal para agregar miembros */}
      {showAddMemberModal && (
        <AddMemberModal
          onClose={() => setShowAddMemberModal(false)}
          onAddDriver={addDriver}
          onAddClient={addClient}
          operatorId={currentOperatorId || ''}
        />
      )}
    </div>
  );
}