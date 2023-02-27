import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null, userRole: null, decryptedToken: null },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload
            state.token = accessToken
            let decryptedToken = parseJwt(accessToken)
            state.decryptedToken = decryptedToken
            state.user = user ?? decryptedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
            state.userRole = !!decryptedToken ? decryptedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]:null
        },
        logOut: (state) => {
            state.token = null
            state.user = null
            state.decryptedToken = null
            state.userRole = null
        }
    }
})

const parseJwt = (token: string) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(
          (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        )
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: any) => state.auth.user
export const selectCurrentToken = (state: any) => state.auth.token
export const selectDecryptedToken = (state: any) => state.auth.decryptedToken
export const selectUserRole = (state: any) => state.auth.userRole