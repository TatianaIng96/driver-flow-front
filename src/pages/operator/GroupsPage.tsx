import { OperatorGroupsList } from '../../components/organisms/OperatorGroupsList';
import { Group, Driver, Client } from '../../App';

interface GroupsPageProps {
  groups: Group[];
  drivers: Driver[];
  clients: Client[];
  onSelectGroup: (id: string) => void;
}

export function GroupsPage({ groups, drivers, clients, onSelectGroup }: GroupsPageProps) {
  return (
    <OperatorGroupsList
      groups={groups}
      drivers={drivers}
      clients={clients}
      onSelectGroup={onSelectGroup}
    />
  );
}
