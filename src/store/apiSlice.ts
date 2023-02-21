import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logOut } from "./authSlice"

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://localhost:7003/api',
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
        const refreshResult: any = await baseQuery('/auth/refresh-access-token',api, extraOptions)
        console.log(refreshResult)

        if(refreshResult?.data) {
            const user = api.getState().auth.user
            api.dispatch(setCredentials({ accessToken: refreshResult.data.token, user}))

            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: builder => ({})
})