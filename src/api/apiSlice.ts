import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logOut } from "../store/authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
    prepareHeaders: (headers: Headers, { getState }: any) => {
        const token = getState().auth.token
        if(token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
    // debugger;
    let result = await baseQuery(args, api, extraOptions)
    let errorCode = result?.error?.status

    if(errorCode === 403 || errorCode === 401) {
        console.log('Sending refresh Token...')
        // const refreshResult: any = await baseQuery('/auth/refresh-access-token',api, extraOptions)
        const token = localStorage.getItem('accessToken')
        console.log(token)

        if(!!token) {
            const user = api.getState().auth.user
            api.dispatch(setCredentials({ accessToken: token, user}))

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: builder => ({}),
    tagTypes: ['Requests']
})