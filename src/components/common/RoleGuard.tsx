import React from 'react';
import { useAppSelector } from '../../hooks';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAppSelector((s) => s.auth.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="p-6">No tienes permisos para ver este contenido.</div>;
  }
  return <>{children}</>;
}

export default RoleGuard;
