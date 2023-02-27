import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDecryptedToken, selectUserRole } from '../store/authSlice'
import { useGetConstructionRequestsQuery } from '../api/constructionApiSlice'
import { selectConstructionRequestsList, setToBeEditedRequest } from '../store/constructionSlice'
import LoadingSpinner from './LoadingSpinner'
import EditRequest from './EditRequest'
import { Link } from 'react-router-dom'
import Paginator from './Paginator'

type Props = {}

const Requests = (props: Props) => {

    const [pageNumber, setPageNumber] = useState(1)

    const userRole = useSelector(selectUserRole)
    const decryptedToken = useSelector(selectDecryptedToken)

    const dispatch = useDispatch()

    const {
        data,
        isLoading,
        isFetching,
        refetch
    } = useGetConstructionRequestsQuery({ userRole, userId: decryptedToken.userId, pageNumber })

        useEffect(() => {
        const refetchRequests = async () => {
            await refetch().unwrap()
        }
        refetchRequests()
    }, [pageNumber])


    // if (isLoading || isFetching) {
    //     return <LoadingSpinner display={true}></LoadingSpinner>
    // }

    return (
        <>
<LoadingSpinner display={isLoading || isFetching}></LoadingSpinner>
            <section className="card">
                <div className="card-header">
                    <h6 className="card-title">Construction Requests</h6>
                </div>
                <div className="card-body table-responsive">
                    <div className="row table-responsive">
                        <table className="table table-hover table-bordered table-sm">
                            <thead className="table-light">
                                <tr>

                                    <th scope="col">ID</th>
                                    <th scope="col">Project Name</th>
                                    <th hidden={userRole !== 'Admin'} scope="col">Client</th>
                                    <th scope="col">Contractor</th>
                                    <th scope="col">Requested Start Date</th>
                                    <th scope="col">Start Date</th>
                                    <th scope="col">Estimated End Date</th>
                                    <th scope="col">Payment Amount</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Project Address</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Remarks</th>
                                    <th scope="col">Added On</th>
                                    <th hidden={userRole !== 'Admin'} scope="col">Added By</th>
                                    <th scope="col">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data as any[])?.map(request => (
                                    <tr key={request.id} style={{ cursor: 'pointer' }}>
                                        <td>{request.id}</td>
                                        <td>{request.projectName}</td>
                                        <td hidden={userRole !== 'Admin'}>{request.client?.fullName}</td>
                                        <td>{request.company?.name ?? 'Un Assigned Yet'}</td>
                                        <td>{request.requestedStartDateAsString}</td>
                                        <td>{request.startDateString}</td>
                                        <td>{request.estimatedEndDateString}</td>
                                        <td>{request.paymentAmount}</td>
                                        <td>{request.status?.name}</td>
                                        <td className='text-expand'><span>
                                            {request.projectAddress}
                                        </span></td>
                                        <td className='text-expand'>{request.description}</td>
                                        <td className='text-expand'>{request.remarks}</td>
                                        <td>{request.addedOnString}</td>
                                        <td hidden={userRole !== 'Admin'}>{request.addedBy}</td>
                                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                            <i
                                                onClick={() => dispatch(setToBeEditedRequest({ ...request }))}
                                                data-bs-toggle="modal"
                                                data-bs-target="#EditModal"
                                                className="bi bi-pencil-square construction-color"
                                            >
                                            </i>
                                            <i
                                            data-bs-toggle="modal"
                                            data-bs-target="#PaymentModal"
                                            onClick={() => dispatch(setToBeEditedRequest({ ...request }))}
                                                hidden={
                                                    !request.paymentAmount ||
                                                    request.status?.id != 2 ||
                                                    userRole != 'Client'} className="bi bi-credit-card-2-back"></i>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Paginator onPageUpdate={(p,s) => setPageNumber(p)} pageSize={10} totalRecords={data?.length || 0}></Paginator>
            </section>
            <div hidden={userRole != 'Client'} className="row">
                <div style={{ textAlign: 'end' }} className="col mt-4">
                    <Link
                        className="btn construction-btn"
                        to={{
                            pathname: "/create-request/"
                        }}
                    >Create New Request</Link>
                </div>
            </div>
        </>
    )
}

export default Requests