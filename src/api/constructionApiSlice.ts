import { apiSlice } from "./apiSlice";

export const constructionApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCurrentClient: builder.query<any,any>({
            query: (userId: number) => `/clients?userId=${userId}`,
            transformResponse: (data:any[], meta, arg) => {
                return data[0]
            }
        }),
       
        getConstructionRequestStatusList: builder.query<any[],any>({
            query: () => '/status',
        }),
        getConstructionCompaniesList: builder.query<any[],any>({
            query: () => '/companies',
        }),
        getConstructionRequests: builder.query<any[],any>({
            query: (params:any) => params.userRole == 'Admin' 
            ? `/construction-requests` 
            :`/construction-requests?client.userId=${params.userId}`,
            keepUnusedDataFor: 5,
            transformResponse: (data:any[], meta, arg) => {
                let updatedData = data.map(r => ({
                    ...r, 
                    startDateString: r.startDate ? new Date(r.startDate).toLocaleDateString('en-AE') : null,
                    estimatedEndDateString: r.estimatedEndDate ? new Date(r.estimatedEndDate).toLocaleDateString('en-AE'): null,
                    addedOnString: r.addedOn ? new Date(r.addedOn).toLocaleString('en-AE'): null,
                    requestedStartDateAsString: r.requestedStartDate ? new Date(r.requestedStartDate).toLocaleDateString('en-AE'): null,
                    paymentDate: r.paymentDate ? new Date(r.paymentDate).toLocaleString('en-AE'): null
                }))
                return updatedData
            },
            providesTags: ['Requests'],
        }),
        updateConstructionRequest: builder.mutation({
            query: (requestBody: any) => ({
                url: `/construction-requests/${requestBody.id}`,
                method: 'PATCH',
                body: {...requestBody}
            }),
            invalidatesTags: ['Requests']
        }),
        submitConstructionRequest: builder.mutation({
            query: (requestBody: any) => ({
                url: '/construction-requests',
                method: 'POST',
                body: {...requestBody}
            }),
            invalidatesTags: ['Requests']
        }),

        validateCreditCard: builder.query<any,any>({
            query: ({nameOnCreditCard, creditCardNumber,expirationDate,cvc,otp}) => {
                let url = '/credit-cards'
                url += `?fullName=${encodeURIComponent(nameOnCreditCard)}`
                url += `&cardNumber=${encodeURIComponent(creditCardNumber)}`
                url += `&expirationDate=${encodeURIComponent(expirationDate)}`
                url += `&cvc=${encodeURIComponent(cvc)}`
                url += `&otp=${encodeURIComponent(otp)}`
                return url
            },
            transformResponse: (data:any[], meta, arg) => {
                return data?.length && data?.length > 0
            }
        })
    })
})

export const { 
    useGetConstructionRequestsQuery, 
    useGetConstructionRequestStatusListQuery,
    useGetConstructionCompaniesListQuery,
    useUpdateConstructionRequestMutation,
    useSubmitConstructionRequestMutation,
    useGetCurrentClientQuery,
    useLazyValidateCreditCardQuery
} = constructionApiSlice