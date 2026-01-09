/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api';

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<any[], void>({
      query: () => ({ url: '/users' }),
      providesTags: ['Users'],
    }),
    createUser: build.mutation<any, Partial<any>>({
      query: (body) => ({ url: '/users/register', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
    updateUser: build.mutation<any, { id: string; body: Partial<any> }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: build.mutation<any, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApi;
