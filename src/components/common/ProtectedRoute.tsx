import React from 'react';
import { useAppSelector } from '../../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAppSelector((s) => s.auth.token);
  if (!token) return <div className="p-6">Acceso denegado. Por favor inicia sesión.</div>;
  return <>{children}</>;
}

export default ProtectedRoute;
