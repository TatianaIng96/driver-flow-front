import { OperatorDriversList } from '../../components/organisms/OperatorDriversList';
import { Driver, Group } from '../../App';

interface DriversPageProps {
  drivers: Driver[];
  groups: Group[];
  onUpdateDriver: (id: string, updates: Partial<Driver>) => void;
  onBanDriver: (id: string, reason: string) => void;
  onAddDriver: (phone: string, name: string, document: string, photo?: string) => { success: boolean; message: string };
}

export function DriversPage({ drivers, groups, onUpdateDriver, onBanDriver, onAddDriver }: DriversPageProps) {
  return (
    <OperatorDriversList
      drivers={drivers}
      groups={groups}
      onUpdateDriver={onUpdateDriver}
      onBanDriver={onBanDriver}
      onAddDriver={onAddDriver}
    />
  );
}
