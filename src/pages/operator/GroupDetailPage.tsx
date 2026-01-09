import { OperatorGroupDetail } from '../../components/organisms/OperatorGroupDetail';
import { Group, Driver, Client } from '../../App';

interface GroupDetailPageProps {
  group: Group;
  drivers: Driver[];
  clients: Client[];
  onBack: () => void;
  onRemoveDriver: (groupId: string, driverId: string) => void;
  onRemoveClient: (groupId: string, clientId: string) => void;
}

export function GroupDetailPage({
  group,
  drivers,
  clients,
  onBack,
  onRemoveDriver,
  onRemoveClient,
}: GroupDetailPageProps) {
  return (
    <OperatorGroupDetail
      group={group}
      drivers={drivers}
      clients={clients}
      onBack={onBack}
      onRemoveDriver={onRemoveDriver}
      onRemoveClient={onRemoveClient}
    />
  );
}
