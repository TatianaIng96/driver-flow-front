import { ReactNode } from 'react';
import { OperatorSidebar } from '../components/organisms';

interface OperatorLayoutProps {
  children: ReactNode;
  userName: string;
}

export function OperatorLayout({ children, userName }: OperatorLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <OperatorSidebar userName={userName} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
