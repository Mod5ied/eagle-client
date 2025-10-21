import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginRequest { email: string; password: string }
interface User { id: string; email: string }
interface LoginResponse { user: User }
interface MeResponse { user: User }

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL + '/api', credentials: 'include' }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth']
    }),
    me: builder.query<MeResponse, void>({
      query: () => ({ url: '/auth/me' }),
      providesTags: ['Auth']
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth']
    })
  })
});

export const { useLoginMutation, useMeQuery, useLogoutMutation } = authApi;
