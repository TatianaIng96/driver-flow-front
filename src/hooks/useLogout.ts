import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '../services/auth';
import { logout as logoutAction } from '../features/auth/authSlice';

export const useLogout = () => {
  const dispatch = useDispatch();
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      // Llamar al endpoint de logout para limpiar la cookie del servidor
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Error al cerrar sesión en el servidor:', error);
      // Continuar con el logout local incluso si falla el servidor
    } finally {
      // Limpiar el estado local
      dispatch(logoutAction());

      // Recargar la página para limpiar todo el estado de la aplicación
      window.location.href = '/';
    }
  };

  return { logout };
};
