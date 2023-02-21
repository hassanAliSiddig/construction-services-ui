import { createSlice } from "@reduxjs/toolkit"

const constructionSlice = createSlice({
    name: 'construction',
    initialState: { constructionRequestsList: [], toBeEditedRequest: null },
    reducers: {
        setConstructionRequestsList: (state, action) => {
            const list = action.payload
            state.constructionRequestsList = list
        },
        setToBeEditedRequest: (state, action) => {
            const { toBeEditedRequest } = action.payload
            state.toBeEditedRequest = toBeEditedRequest
        }
    }
})

export const { setConstructionRequestsList, setToBeEditedRequest } = constructionSlice.actions

export default constructionSlice.reducer

export const selectConstructionRequestsList = (state: any) => state.construction.constructionRequestsList
export const selectToBeEditedRequest = (state: any) => state.construction.toBeEditedRequest
