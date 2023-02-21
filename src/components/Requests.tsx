import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDecryptedToken, selectUserRole } from '../store/authSlice'
import { useGetConstructionRequestsQuery } from '../store/constructionApiSlice'
import { selectConstructionRequestsList, setToBeEditedRequest } from '../store/constructionSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const Requests = (props: Props) => {

    const userRole = useSelector(selectUserRole)

    const requestsFromStore: any[] = useSelector(selectConstructionRequestsList)

    const dispatch = useDispatch()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetConstructionRequestsQuery(undefined, { skip: !!requestsFromStore && requestsFromStore.length > 0 })

    const setRequestToBeEdited = (id: any) => {
        let toBeEditedRequest = (data as any[]).find(r => r.constructionRequestID == id)
        dispatch(setToBeEditedRequest({ toBeEditedRequest }))
    }

    if (isLoading) {
        return <LoadingSpinner display={true}></LoadingSpinner>
    }

    return (
        <section className="card">
            <div className="card-header">
                <h6 className="card-title">Construction Requests</h6>
            </div>
            <div className="card-body table-responsive">
                <div className="row table-responsive">
                    <table className="table table-hover table-bordered table-sm">
                        <thead className="table-light">
                            <tr>
                                <th hidden={userRole != 'Admin'} scope="col">
                                </th>
                                <th scope="col">ID</th>
                                <th scope="col">Client</th>
                                <th scope="col">Company</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">Estimated End Date</th>
                                <th scope="col">Payment Amount</th>
                                <th scope="col">Project</th>
                                <th scope="col">Status</th>
                                <th scope="col">Description</th>
                                <th scope="col">Remarks</th>
                                <th scope="col">Added On</th>
                                <th hidden={userRole !== 'Admin'} scope="col">Added By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data as any[]).map(request => (
                                <tr key={request.constructionRequestID} style={{ cursor: 'pointer' }}>
                                    <td hidden={userRole != 'Admin'}>
                                        <i onClick={() => setRequestToBeEdited(request.constructionRequestID)} data-bs-toggle="modal" data-bs-target="#EditModal" className="bi bi-pencil-square construction-color"></i>
                                    </td>
                                    <td>{request.constructionRequestID}</td>
                                    <td>{request.client}</td>
                                    <td>{request.company}</td>
                                    <td>{request.startDate}</td>
                                    <td>{request.estimatedEndDate}</td>
                                    <td>{request.paymentAmount}</td>
                                    <td>{request.project}</td>
                                    <td>{request.status}</td>
                                    <td className='text-expand'>{request.description}</td>
                                    <td className='text-expand'>{request.remarks}</td>
                                    <td>{request.addedOn}</td>
                                    <td hidden={userRole !== 'Admin'}>{request.addedBy}</td>
                                </tr>
                            ))}



                        </tbody>
                    </table>
                </div>
                <div hidden={userRole != 'Client'} className="row">
                    <div style={{textAlign:'end'}} className="col mt-4">
                        <button type="button" style={{ backgroundColor: '#3F3F3F' }} data-bs-toggle="modal" data-bs-target="#CreateModal" className="btn btn-secondary">Create Construction Request</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Requests