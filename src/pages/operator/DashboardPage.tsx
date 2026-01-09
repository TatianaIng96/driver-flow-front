import { OperatorDashboard } from '../../components/organisms/OperatorDashboard';
import { Operator, Driver, Client, Group, BannedNumber } from '../../App';

interface DashboardPageProps {
  operator: Operator;
  drivers: Driver[];
  clients: Client[];
  groups: Group[];
  bannedNumbers: BannedNumber[];
}

export function DashboardPage({ operator, drivers, clients, groups, bannedNumbers }: DashboardPageProps) {
  return (
    <OperatorDashboard
      operator={operator}
      drivers={drivers}
      clients={clients}
      groups={groups}
      bannedNumbers={bannedNumbers}
    />
  );
}
