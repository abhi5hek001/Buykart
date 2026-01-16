import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration with RTK Query
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,    
    }),
    tagTypes: ['Products', 'Product', 'Categories', 'Orders', 'Cart', 'Users'],
    endpoints: (builder) => ({
        // Products
        getProducts: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.category) queryParams.append('category', params.category);
                if (params.search) queryParams.append('search', params.search);
                return `/products${queryParams.toString() ? `?${queryParams}` : ''}`;
            },
            providesTags: ['Products'],
        }),

        getProductById: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),

        // Categories
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: ['Categories'],
        }),

        // Users
        getUsers: builder.query({
            query: () => '/users',
            providesTags: ['Users'],
        }),

        getUserById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),

        // Orders
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders'],
        }),

        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
        }),

        getOrdersByUser: builder.query({
            query: (userId) => `/orders/user/${userId}`,
            providesTags: ['Orders'],
        }),

        // Stock polling
        getStock: builder.query({
            query: () => '/stock',
            providesTags: ['Stock'],
        }),
    }),
});
export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateOrderMutation,
    useGetOrderByIdQuery,
    useGetOrdersByUserQuery,
    useGetStockQuery,
} = apiSlice;
