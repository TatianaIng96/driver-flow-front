import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { mockOperators } from './data/mockData';
import { AppRoutes } from './routes';
import type { RootState } from './store';

export type UserRole = 'admin' | 'operator';

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
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedOperatorId, setSelectedOperatorId] = useState<string | null>(null);

  const [appState, setAppState] = useState<AppState>({
    operators: mockOperators,
    drivers: [],
    clients: [],
    groups: [],
    bannedNumbers: [],
  });

  // Verificar sesión al cargar la app
  useEffect(() => {
    // Solo verificar si hay un token, no refrescarlo automáticamente
    // El refresh se hará automáticamente cuando sea necesario en el middleware
    setIsCheckingAuth(false);
  }, []); // Solo ejecutar una vez al montar

  // Sincronizar el usuario de Redux con el estado local al cargar o cambiar
  useEffect(() => {
    if (reduxUser && !currentUser) {
      const user: User = {
        id: reduxUser.id,
        name: reduxUser.name,
        email: reduxUser.email,
        role: reduxUser.role as UserRole,
        operatorId: reduxUser.operatorId,
      };
      setCurrentUser(user);

      // Si es un operador y tiene operatorId, verificar que exista en los datos
      if (user.role === 'operator' && user.operatorId) {
        setAppState((prev) => {
          const operatorExists = prev.operators.some((op) => op.id === user.operatorId);

          if (!operatorExists && user.operatorId) {
            const newOperator: Operator = {
              id: user.operatorId,
              name: user.name,
              email: user.email,
              phone: '',
              createdAt: new Date().toISOString(),
              isActive: true,
              settings: {
                groupBaseName: `Grupo ${user.name}`,
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

            console.log('✅ Creando nuevo operador para el usuario:', newOperator);

            return {
              ...prev,
              operators: [...prev.operators, newOperator],
            };
          }

          return prev;
        });
      }
    }
  }, [reduxUser, currentUser]);

  // Mostrar loading mientras se verifica la sesión
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar login
  if (!reduxUser || !currentUser) {
    return (
      <LoginPage
        onLogin={(user) => {
          setCurrentUser(user);

          // Si es un operador y tiene operatorId, verificar que exista en los datos
          if (user.role === 'operator' && user.operatorId) {
            setAppState((prev) => {
              const operatorExists = prev.operators.some((op) => op.id === user.operatorId);

              if (!operatorExists && user.operatorId) {
                const newOperator: Operator = {
                  id: user.operatorId,
                  name: user.name,
                  email: user.email,
                  phone: '',
                  createdAt: new Date().toISOString(),
                  isActive: true,
                  settings: {
                    groupBaseName: `Grupo ${user.name}`,
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

                console.log('✅ Creando nuevo operador para el usuario:', newOperator);

                return {
                  ...prev,
                  operators: [...prev.operators, newOperator],
                };
              }

              return prev;
            });
          }
        }}
      />
    );
  }

  const handleSelectOperator = (id: string) => {
    setSelectedOperatorId(id);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Debug logging
  console.log('🔍 Current User:', currentUser);
  console.log('🏢 Current Operator ID:', currentOperatorId);
  console.log('📋 Available Operators:', appState.operators.map(o => ({ id: o.id, name: o.name })));

  return (
    <Routes>
      <Route path="/" element={<Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/operator/dashboard'} replace />} />
      <Route
        path="/*"
        element={
          <AppRoutes
            appState={appState}
            currentOperatorId={currentOperatorId || null}
            selectedOperatorId={selectedOperatorId}
            onSelectOperator={handleSelectOperator}
            createOperator={createOperator}
            updateOperatorSettings={updateOperatorSettings}
            addDriver={(phone, name, document, photo) =>
              addDriver(currentOperatorId || '', phone, name, document, photo)
            }
            addClient={(phone, name) => addClient(currentOperatorId || '', phone, name)}
            updateDriver={updateDriver}
            banDriver={banDriver}
            banClient={banClient}
            removeDriverFromGroup={removeDriverFromGroup}
            removeClientFromGroup={removeClientFromGroup}
            updateWhatsAppConnection={updateWhatsAppConnection}
          />
        }
      />
    </Routes>
  );
}