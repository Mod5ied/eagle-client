import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ProductEntity } from '@store/slices/products.slice';

interface CreateProductRequest extends Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'> {}
interface UpdateProductRequest { id: string; data: Partial<Omit<ProductEntity, 'id'>> }
interface ToggleStatusRequest { id: string; status: ProductEntity['status'] }

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL + '/api', credentials: 'include' }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    list: builder.query<ProductEntity[], void>({
      query: () => ({ url: '/products' }),
      // Normalize any server response shape into a ProductEntity[]
      transformResponse: (response: any): ProductEntity[] => {
        let raw: any[] | undefined;
        if (Array.isArray(response)) raw = response;
        else if (Array.isArray(response?.data)) raw = response.data;
        else if (Array.isArray(response?.products)) raw = response.products;
        else if (Array.isArray(response?.items)) raw = response.items;
        if (!raw) return [];
        return raw.map((p) => ({
          ...p,
          createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
          updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined,
        }));
      },
      providesTags: (result) => {
        if (!result) return [ { type: 'Products', id: 'LIST' } ];
        return [ { type: 'Products', id: 'LIST' }, ...result.map(r => ({ type: 'Products' as const, id: r.id })) ];
      }
    }),
    create: builder.mutation<{ id: string }, CreateProductRequest>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: [ { type: 'Products', id: 'LIST' } ]
    }),
    update: builder.mutation<void, UpdateProductRequest>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, arg) => [ { type: 'Products', id: arg.id } ]
    }),
    remove: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [ { type: 'Products', id } ]
    }),
    toggleStatus: builder.mutation<void, ToggleStatusRequest>({
      query: ({ id, status }) => ({ url: `/products/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (result, error, arg) => [ { type: 'Products', id: arg.id } ]
    })
  })
});

export const { useListQuery, useCreateMutation, useUpdateMutation, useRemoveMutation, useToggleStatusMutation } = productsApi;