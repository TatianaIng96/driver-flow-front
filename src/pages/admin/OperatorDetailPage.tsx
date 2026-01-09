import { OperatorDetail } from '../../components/organisms';
import { Operator, Driver, Client, Group, OperatorSettings } from '../../App';

interface OperatorDetailPageProps {
  operator: Operator;
  drivers: Driver[];
  clients: Client[];
  groups: Group[];
  onBack: () => void;
  onUpdateSettings: (operatorId: string, settings: Partial<OperatorSettings>) => void;
}

export function OperatorDetailPage({
  operator,
  drivers,
  clients,
  groups,
  onBack,
  onUpdateSettings,
}: OperatorDetailPageProps) {
  return (
    <OperatorDetail
      operator={operator}
      drivers={drivers}
      clients={clients}
      groups={groups}
      onBack={onBack}
      onUpdateSettings={onUpdateSettings}
    />
  );
}
