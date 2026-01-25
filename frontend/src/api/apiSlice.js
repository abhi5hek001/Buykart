import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration with RTK Query
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://buykart-backend.sahayabhishek.tech/api',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().user.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Products', 'Product', 'Categories', 'Orders', 'Cart', 'Users'],
    endpoints: (builder) => ({
        // Auth
        signup: builder.mutation({
            query: (data) => ({
                url: '/auth/signup',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Users'],
        }),

        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signin',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Users', 'Cart', 'Wishlist', 'Orders'],
        }),

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

        // Orders
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders', 'Cart'],
        }),

        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),

        getOrdersByUser: builder.query({
            query: () => `/orders/my-orders`,
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
    useSignupMutation,
    useLoginMutation,
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useGetUsersQuery,
    useCreateOrderMutation,
    useGetOrderByIdQuery,
    useGetOrdersByUserQuery,
    useGetStockQuery,
} = apiSlice;
