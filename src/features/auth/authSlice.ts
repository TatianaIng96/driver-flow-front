import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export type User = { id: string; name: string; email: string; role: string; operatorId?: string } | null;

export interface AuthState {
  token: string | null;
  user: User;
}

interface JwtPayload {
  exp: number;
  iat: number;
}

// Función para verificar si el token está por vencer (menos de 5 minutos)
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    // Refrescar si quedan menos de 5 minutos (300 segundos)
    return timeUntilExpiry < 300;
  } catch {
    return true; // Si no se puede decodificar, asumir que debe refrescarse
  }
};

// Función para verificar si el token está expirado
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? Cookies.get('accessToken') || null : null,
  user: typeof window !== 'undefined' && Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      try {
        // Guardar accessToken en cookie (expira cuando se cierra el navegador - session cookie)
        Cookies.set('accessToken', action.payload.token, {
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
        // Guardar user info en cookie
        Cookies.set('user', JSON.stringify(action.payload.user), {
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });
      } catch (e) {
        console.error('Error guardando credenciales:', e);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      try {
        // Limpiar cookies
        Cookies.remove('accessToken');
        Cookies.remove('user');
        // También limpiar storage por si quedaron datos antiguos
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {
        console.error('Error limpiando credenciales:', e);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
