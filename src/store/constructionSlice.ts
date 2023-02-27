import { createSlice } from "@reduxjs/toolkit"

const constructionSlice = createSlice({
    name: 'construction',
    initialState: { 
        constructionRequestsList: [], 
        toBeEditedRequest: null,
        statusList: [],
        currentClient: null
    },
    reducers: {
        setConstructionRequestsList: (state, action) => {
            state.constructionRequestsList = action.payload
        },
        setStatusList: (state, action) => {
            state.statusList = action.payload
        },
        setToBeEditedRequest: (state, action) => {
            const toBeEditedRequest = action.payload
            state.toBeEditedRequest = {
                ...toBeEditedRequest
            }
        },
        setCurrentClient: (state, action) => {
            state.currentClient = action.payload
        }
    }
})

export const { setConstructionRequestsList, setToBeEditedRequest } = constructionSlice.actions

export default constructionSlice.reducer

export const selectConstructionRequestsList = (state: any) => state.construction.constructionRequestsList
export const selectToBeEditedRequest = (state: any) => state.construction.toBeEditedRequest
export const selectStatusList = (state: any) => state.construction.statusList
export const selectCurrentClient = (state: any) => state.construction.currentClient
