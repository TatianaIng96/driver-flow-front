import { OperatorSettings } from '../../components/organisms/OperatorSettings';
import { Operator, OperatorSettings as OperatorSettingsType } from '../../App';

interface SettingsPageProps {
  operator: Operator;
  onUpdateSettings: (operatorId: string, settings: Partial<OperatorSettingsType>) => void;
}

export function SettingsPage({ operator, onUpdateSettings }: SettingsPageProps) {
  return <OperatorSettings operator={operator} onUpdateSettings={onUpdateSettings} />;
}
