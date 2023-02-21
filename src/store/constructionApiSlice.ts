import { apiSlice } from "./apiSlice";

export const constructionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getConstructionRequestStatusList: builder.query({
            query: () => '/construction/get-construction-request-status-list',
            keepUnusedDataFor: 5,
        }),
        getConstructionCompaniesList: builder.query({
            query: () => '/construction/get-construction-companies-list',
            keepUnusedDataFor: 5,
        }),
        getConstructionProjectsList: builder.query({
            query: () => '/construction/get-construction-projects-list',
            keepUnusedDataFor: 5,
        }),
        getConstructionRequests: builder.query({
            query: () => '/construction/get-construction-requests',
            keepUnusedDataFor: 5,
        }),
        updateConstructionRequest: builder.mutation({
            query: (requestBody: any) => ({
                url: '/construction/update-construction-request',
                method: 'POST',
                body: {...requestBody}
            })
        }),
        submitConstructionRequest: builder.mutation({
            query: (requestBody: any) => ({
                url: '/construction/submit-construction-request',
                method: 'POST',
                body: {...requestBody}
            })
        }),

    })
})

export const { 
    useGetConstructionRequestsQuery, 
    useGetConstructionRequestStatusListQuery,
    useGetConstructionCompaniesListQuery,
    useGetConstructionProjectsListQuery,
    useUpdateConstructionRequestMutation,
    useSubmitConstructionRequestMutation
} = constructionApiSlice