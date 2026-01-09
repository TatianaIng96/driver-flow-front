import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook personalizado para acceder a los datos de autenticación
 * @returns Objeto con token, user y flags de autenticación
 */
export const useAuth = () => {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  return {
    token,
    user,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isOperator: user?.role === 'operator',
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
    userRole: user?.role,
  };
};
