import { SuperAdminDashboard } from '../../components/organisms';
import { AppState } from '../../App';

interface DashboardPageProps {
  appState: AppState;
  onNavigate: (view: string, id?: string) => void;
}

export function DashboardPage({ appState, onNavigate }: DashboardPageProps) {
  return <SuperAdminDashboard appState={appState} onNavigate={onNavigate} />;
}
