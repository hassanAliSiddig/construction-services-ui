import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials: any) => ({
                url: '/auth/get-access-token',
                method: 'POST',
                body: {...credentials}
            })
        }),
        refreshToken: builder.query({
            query: () => '/auth/refresh-access-token',
            keepUnusedDataFor: 5,
        }),
        logout: builder.query({
            query: () => '/auth/logout'
        })
    })
})

export const { useLoginMutation, useRefreshTokenQuery, useLogoutQuery } = authApiSlice