import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.query({
            query: (credentials: any) => ({
                url: `/auth/get-access-token?username=${credentials.username}&password=${credentials.password}`,
                method: 'GET'
            }),
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

export const { useLazyLoginQuery, useRefreshTokenQuery, useLogoutQuery, useLazyLogoutQuery } = authApiSlice