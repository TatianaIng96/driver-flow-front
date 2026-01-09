import { WhatsAppConnection } from '../../components/organisms/WhatsAppConnection';
import { Operator, WhatsAppConnection as WhatsAppConnectionType } from '../../App';

interface WhatsAppPageProps {
  operator: Operator;
  onUpdateConnection: (operatorId: string, connection: WhatsAppConnectionType) => void;
}

export function WhatsAppPage({ operator, onUpdateConnection }: WhatsAppPageProps) {
  return <WhatsAppConnection operator={operator} onUpdateConnection={onUpdateConnection} />;
}
