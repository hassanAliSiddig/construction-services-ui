import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import authSlice from './authSlice'
import constructionSlice from './constructionSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice,
        construction: constructionSlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export type RootState = ReturnType<typeof store.getState>