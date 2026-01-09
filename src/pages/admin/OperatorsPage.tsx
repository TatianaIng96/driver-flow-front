import { OperatorsList } from '../../components/organisms';
import { Operator } from '../../App';

interface OperatorsPageProps {
  readonly operators: Operator[];
  readonly onSelectOperator: (id: string) => void;
}

export function OperatorsPage({ operators, onSelectOperator }: OperatorsPageProps) {
  return (
    <OperatorsList
      operators={operators}
      onSelectOperator={onSelectOperator}
    />
  );
}
