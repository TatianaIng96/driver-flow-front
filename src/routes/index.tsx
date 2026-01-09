/* eslint-disable @typescript-eslint/no-explicit-any */
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

// Admin Pages
import * as AdminPages from '../pages/admin';

// Operator Pages
import * as OperatorPages from '../pages/operator';

// Layouts
import { AdminLayout } from '../layouts/AdminLayout';
import { OperatorLayout } from '../layouts/OperatorLayout';

// Types
import type { AppState } from '../App';

interface AppRoutesProps {
  appState: AppState;
  currentOperatorId: string | null;
  selectedOperatorId: string | null;
  onSelectOperator: (id: string) => void;
  createOperator: (name: string, email: string, phone: string) => any;
  updateOperatorSettings: (operatorId: string, settings: any) => void;
  addDriver: (phone: string, name: string, document: string, photo?: string) => any;
  addClient: (phone: string, name: string) => any;
  updateDriver: (id: string, updates: any) => void;
  banDriver: (id: string, reason: string) => void;
  banClient: (id: string, reason: string) => void;
  removeDriverFromGroup: (groupId: string, driverId: string) => void;
  removeClientFromGroup: (groupId: string, clientId: string) => void;
  updateWhatsAppConnection: (operatorId: string, connection: any) => void;
}

// Wrapper component for Admin Dashboard
function AdminDashboardWrapper({ appState }: { appState: AppState }) {
  const navigate = useNavigate();
  return <AdminPages.DashboardPage appState={appState} onNavigate={(view) => navigate(`/admin/${view}`)} />;
}

// Wrapper component for Operators Page
function OperatorsPageWrapper({
  operators,
  onSelectOperator,
}: {
  operators: any[];
  onSelectOperator: (id: string) => void;
  createOperator: (name: string, email: string, phone: string) => any;
}) {
  const navigate = useNavigate();
  return (
    <AdminPages.OperatorsPage
      operators={operators}
      onSelectOperator={(id) => {
        onSelectOperator(id);
        navigate(`/admin/operators/${id}`);
      }}
    />
  );
}

// Wrapper component for Operator Detail
function OperatorDetailWrapper({
  appState,
  selectedOperatorId,
  updateOperatorSettings,
}: {
  appState: AppState;
  selectedOperatorId: string | null;
  updateOperatorSettings: (operatorId: string, settings: any) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const operatorId = id || selectedOperatorId;

  if (!operatorId) {
    return <Navigate to="/admin/operators" replace />;
  }

  const operator = appState.operators.find((o) => o.id === operatorId);
  if (!operator) {
    return <Navigate to="/admin/operators" replace />;
  }

  return (
    <AdminPages.OperatorDetailPage
      operator={operator}
      drivers={appState.drivers.filter((d) => d.operatorId === operatorId)}
      clients={appState.clients.filter((c) => c.operatorId === operatorId)}
      groups={appState.groups.filter((g) => g.operatorId === operatorId)}
      onBack={() => navigate('/admin/operators')}
      onUpdateSettings={updateOperatorSettings}
    />
  );
}

// Wrapper component for Groups Page
function GroupsPageWrapper({
  appState,
  currentOperatorId,
  onSelectOperator,
}: {
  appState: AppState;
  currentOperatorId: string | null;
  onSelectOperator: (id: string) => void;
}) {
  const navigate = useNavigate();

  if (!currentOperatorId) return null;

  return (
    <OperatorPages.GroupsPage
      groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
      drivers={appState.drivers.filter((d) => d.operatorId === currentOperatorId)}
      clients={appState.clients.filter((c) => c.operatorId === currentOperatorId)}
      onSelectGroup={(id) => {
        onSelectOperator(id);
        navigate(`/operator/groups/${id}`);
      }}
    />
  );
}

// Wrapper component for Group Detail
function GroupDetailWrapper({
  appState,
  removeDriverFromGroup,
  removeClientFromGroup,
}: {
  appState: AppState;
  removeDriverFromGroup: (groupId: string, driverId: string) => void;
  removeClientFromGroup: (groupId: string, clientId: string) => void;
}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to="/operator/groups" replace />;
  }

  const group = appState.groups.find((g) => g.id === id);
  if (!group) {
    return <Navigate to="/operator/groups" replace />;
  }

  return (
    <OperatorPages.GroupDetailPage
      group={group}
      drivers={appState.drivers}
      clients={appState.clients}
      onBack={() => navigate('/operator/groups')}
      onRemoveDriver={removeDriverFromGroup}
      onRemoveClient={removeClientFromGroup}
    />
  );
}

export function AppRoutes({
  appState,
  currentOperatorId,
  selectedOperatorId,
  onSelectOperator,
  createOperator,
  updateOperatorSettings,
  addDriver,
  addClient,
  updateDriver,
  banDriver,
  banClient,
  removeDriverFromGroup,
  removeClientFromGroup,
  updateWhatsAppConnection,
}: AppRoutesProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin Routes
  if (user.role === 'admin') {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboardWrapper appState={appState} />} />
          <Route
            path="/admin/operators"
            element={
              <OperatorsPageWrapper
                operators={appState.operators}
                onSelectOperator={onSelectOperator}
                createOperator={createOperator}
              />
            }
          />
          <Route
            path="/admin/operators/:id"
            element={
              <OperatorDetailWrapper
                appState={appState}
                selectedOperatorId={selectedOperatorId}
                updateOperatorSettings={updateOperatorSettings}
              />
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  // Operator Routes
  const currentOperator = currentOperatorId ? appState.operators.find((o) => o.id === currentOperatorId) : null;

  if (!currentOperatorId || !currentOperator) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error de Configuración</h2>
          <p className="text-gray-700 mb-2">No se encontró un operador asociado a tu cuenta.</p>
          <p className="text-gray-600 text-sm mb-4">
            Operator ID: <code className="bg-gray-100 px-2 py-1 rounded">{currentOperatorId || 'undefined'}</code>
          </p>
          <p className="text-gray-600 text-sm">Por favor contacta al administrador del sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <OperatorLayout userName={user.name}>
      <Routes>
        <Route
          path="/operator/dashboard"
          element={
            <OperatorPages.DashboardPage
              operator={currentOperator}
              drivers={appState.drivers.filter((d) => d.operatorId === currentOperatorId)}
              clients={appState.clients.filter((c) => c.operatorId === currentOperatorId)}
              groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
              bannedNumbers={appState.bannedNumbers.filter((b) => b.operatorId === currentOperatorId)}
            />
          }
        />
        <Route
          path="/operator/whatsapp"
          element={
            <OperatorPages.WhatsAppPage operator={currentOperator} onUpdateConnection={updateWhatsAppConnection} />
          }
        />
        <Route
          path="/operator/drivers"
          element={
            <OperatorPages.DriversPage
              drivers={appState.drivers.filter((d) => d.operatorId === currentOperatorId)}
              groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
              onUpdateDriver={updateDriver}
              onBanDriver={banDriver}
              onAddDriver={addDriver}
            />
          }
        />
        <Route
          path="/operator/clients"
          element={
            <OperatorPages.ClientsPage
              clients={appState.clients.filter((c) => c.operatorId === currentOperatorId)}
              groups={appState.groups.filter((g) => g.operatorId === currentOperatorId)}
              onBanClient={banClient}
              onAddClient={addClient}
            />
          }
        />
        <Route
          path="/operator/groups"
          element={
            <GroupsPageWrapper
              appState={appState}
              currentOperatorId={currentOperatorId}
              onSelectOperator={onSelectOperator}
            />
          }
        />
        <Route
          path="/operator/groups/:id"
          element={
            <GroupDetailWrapper
              appState={appState}
              removeDriverFromGroup={removeDriverFromGroup}
              removeClientFromGroup={removeClientFromGroup}
            />
          }
        />
        <Route
          path="/operator/banned"
          element={
            <div className="p-6 md:p-8">
              <h1 className="text-gray-900 mb-2">Números Vetados</h1>
              <p className="text-gray-600 mb-6">Gestión de conductores y clientes vetados</p>
            </div>
          }
        />
        <Route
          path="/operator/settings"
          element={<OperatorPages.SettingsPage operator={currentOperator} onUpdateSettings={updateOperatorSettings} />}
        />
        <Route path="/operator/*" element={<Navigate to="/operator/dashboard" replace />} />
      </Routes>
    </OperatorLayout>
  );
}
