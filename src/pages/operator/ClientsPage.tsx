import { OperatorClientsList } from '../../components/organisms/OperatorClientsList';
import { Client, Group } from '../../App';

interface ClientsPageProps {
  clients: Client[];
  groups: Group[];
  onBanClient: (id: string, reason: string) => void;
  onAddClient: (phone: string, name: string) => { success: boolean; message: string };
}

export function ClientsPage({ clients, groups, onBanClient, onAddClient }: ClientsPageProps) {
  return (
    <OperatorClientsList
      clients={clients}
      groups={groups}
      onBanClient={onBanClient}
      onAddClient={onAddClient}
    />
  );
}
