import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout, isTokenExpired } from '../features/auth/authSlice';
import { jwtDecode } from 'jwt-decode';

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000/api';

// Variable para evitar múltiples refreshes simultáneos
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: 'include', // Importante: incluir cookies en las peticiones
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth?.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  }
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Verificar si el token está expirado antes de hacer la petición
  const state = api.getState() as any;
  const currentToken = state.auth?.token;

  if (currentToken && isTokenExpired(currentToken)) {
    console.log('⚠️ Token expirado detectado antes de la petición');

    // Si ya hay un refresh en proceso, esperar a que termine
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
    } else {
      // Iniciar proceso de refresh
      isRefreshing = true;
      refreshPromise = baseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      ).then((refreshResult) => {
        isRefreshing = false;
        refreshPromise = null;

        if (refreshResult.data) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          const decoded = jwtDecode<any>(accessToken);

          const user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.roles,
            name: decoded.email.split('@')[0],
            operatorId: decoded.operatorId || (decoded.roles === 'operator' ? decoded.sub : undefined),
          };

          api.dispatch(setCredentials({ token: accessToken, user }));
          console.log('✅ Token refrescado exitosamente');
          return true;
        } else {
          console.log('❌ No se pudo refrescar el token, cerrando sesión');
          api.dispatch(logout());
          return false;
        }
      }).catch(() => {
        isRefreshing = false;
        refreshPromise = null;
        api.dispatch(logout());
        return false;
      });

      await refreshPromise;
    }
  }

  // Hacer la petición original
  let result = await baseQuery(args, api, extraOptions);

  // Si aún así recibimos 401, intentar refrescar una vez más
  if (result.error && result.error.status === 401 && !isRefreshing) {
    console.log('🔄 Error 401 recibido, intentando refrescar token...');

    isRefreshing = true;
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );
    isRefreshing = false;

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };
      const decoded = jwtDecode<any>(accessToken);

      const user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.roles,
        name: decoded.email.split('@')[0],
        operatorId: decoded.operatorId || (decoded.roles === 'operator' ? decoded.sub : undefined),
      };

      api.dispatch(setCredentials({ token: accessToken, user }));
      console.log('✅ Token refrescado después de 401');

      // Reintentar la petición original
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('❌ No se pudo refrescar el token, cerrando sesión');
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Users'],
  endpoints: () => ({}),
});

export default api;
