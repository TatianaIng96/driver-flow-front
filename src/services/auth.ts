/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  roles: string;
  operatorId?: string;
  iat: number;
  exp: number;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string; user: any }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: { accessToken: string }) => {
        // Decodificar el JWT para extraer los datos del usuario
        const decoded = jwtDecode<JwtPayload>(response.accessToken);

        console.log('🔐 JWT Decoded:', decoded);
        console.log('👤 User role:', decoded.roles);
        console.log('🏢 Operator ID from JWT:', decoded.operatorId);

        // Si es un operador y no tiene operatorId en el JWT, usar su sub como operatorId
        let operatorId = decoded.operatorId;
        if (decoded.roles === 'operator' && !operatorId) {
          operatorId = decoded.sub;
          console.log('⚠️ No operatorId in JWT, using user ID as operatorId:', operatorId);
        }

        return {
          token: response.accessToken,
          user: {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.roles,
            name: decoded.email.split('@')[0], // Extraer nombre del email como fallback
            operatorId: operatorId, // Extraer operatorId del JWT o usar el ID del usuario
          },
        };
      },
      invalidatesTags: ['User'],
    }),
    refresh: build.mutation<{ token: string; user: any }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      transformResponse: (response: { accessToken: string }) => {
        // Decodificar el JWT para extraer los datos del usuario
        const decoded = jwtDecode<JwtPayload>(response.accessToken);

        let operatorId = decoded.operatorId;
        if (decoded.roles === 'operator' && !operatorId) {
          operatorId = decoded.sub;
        }

        return {
          token: response.accessToken,
          user: {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.roles,
            name: decoded.email.split('@')[0],
            operatorId: operatorId,
          },
        };
      },
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    me: build.query<{ id: string; name: string; email: string; role: string }, void>({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation, useMeQuery } = authApi;
