import { FormEvent, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { useGetConstructionCompaniesListQuery, useGetConstructionRequestsQuery, useGetConstructionRequestStatusListQuery, useUpdateConstructionRequestMutation } from '../api/constructionApiSlice';
import { selectUserRole } from '../store/authSlice';
import { selectStatusList, selectToBeEditedRequest, setConstructionRequestsList } from '../store/constructionSlice';
import LoadingSpinner from './LoadingSpinner';

type Props = {
}

const EditRequest = (props: Props) => {

    let request = useSelector(selectToBeEditedRequest)
    const userRole = useSelector(selectUserRole)
    const closeModalRef = useRef<HTMLButtonElement>(null)

    const {
        data: statusList,
        isLoading: isStatusListLoading
    } = useGetConstructionRequestStatusListQuery(undefined)

    const {
        data: companiesList,
        isLoading: isCompaniesListLoading
    } = useGetConstructionCompaniesListQuery(undefined)

    let startDateDefault = request?.startDate ? new Date(request?.startDate) : null
    let estimatedEndDateDefault = request?.estimatedEndDate ? new Date(request?.estimatedEndDate) : null

    const [startDate, setStartDate] = useState<Date>()
    const [requestedStartDate, setRequestedStartDate] = useState<Date>()
    const [estimatedEndDate, setEstimatedEndDate] = useState<Date>()
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [statusId, setStatusId] = useState(0)
    const [companyId, setCompanyId] = useState(0)
    const [remarks, setRemarks] = useState('')
    const [projectAddress, setProjectAddress] = useState('')
    const [paymentAmount, setPaymentAmount] = useState<number>(0)


    useEffect(() => {
        if (!request) {
            return
        }
        if (!!startDateDefault) {
            setStartDate(startDateDefault)
        }
        if (!!estimatedEndDateDefault) {
            setEstimatedEndDate(estimatedEndDateDefault)
        }
        setRequestedStartDate(new Date(request.requestedStartDate))
        setRemarks(request.remarks ?? remarks)
        setProjectName(request.projectName ?? projectName)
        setDescription(request.description ?? description)
        setProjectAddress(request.projectAddress ?? projectAddress)
        setStatusId(request.status?.id ?? statusId)
        setCompanyId(request.company?.id ?? companyId)
        setPaymentAmount(request.paymentAmount ?? paymentAmount)
    }, [request])



    const [updateRequest, { isLoading }] = useUpdateConstructionRequestMutation()

    const submitUpdateRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let updatedStatus = statusList?.find(s => s.id == statusId)
        let updatedCompany = companiesList?.find(s => s.id == companyId)

        let requestBody = {
            ...request,
            startDate: startDate?.toJSON(),
            estimatedEndDate: estimatedEndDate?.toJSON(),
            description,
            remarks,
            paymentAmount,
            status: updatedStatus ?? request.status,
            company: updatedCompany ?? request.company,
            projectAddress
        }

        try {

            let response = await updateRequest(requestBody).unwrap()

        } catch (error) {
            console.log(error)
            alert('The update request failed')
        } finally {
            closeModalRef?.current?.click()
        }
    }

    if (isLoading) {
        return (<LoadingSpinner display={true}></LoadingSpinner>)
    }

    return (
        <section className="card">
            <div className="card-header" style={{display:'flex', justifyContent:'space-between'}}>
                <h6 className="card-title">Edit Request Form (Request ID = {request?.id})</h6>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="card-body">
                <form onSubmit={e => submitUpdateRequest(e)}>
                    <div className='row'>
                        <div hidden={userRole !== 'Admin'} className="col-md-6 mb-4">
                            <label className="form-label">Client Name</label>
                            <input
                                disabled
                                required
                                className="form-control"
                                defaultValue={request?.client?.fullName}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className="form-label">Project Name</label>
                            <textarea
                                disabled={userRole != 'Client' || request?.status?.id != 1}
                                className="form-control"
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className="form-label">Description</label>
                            <textarea
                                disabled={userRole != 'Client' || request?.status?.id != 1}
                                className="form-control"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className="form-label">Remarks</label>
                            <textarea
                                disabled={userRole != 'Admin'}
                                className="form-control"
                                value={remarks}
                                onChange={e => setRemarks(e.target.value)}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className="form-label">Project Address</label>
                            <textarea
                                disabled={userRole != 'Client' || request?.status?.id != 1}
                                className="form-control"
                                value={projectAddress}
                                onChange={e => setProjectAddress(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Requested Start Date</label>
                            <DatePicker
                               required
                               disabled={userRole != 'Client'}
                               dateFormat="dd/MM/yyyy"
                               className="form-control"
                               placeholderText='Click to select a date'
                               selected={requestedStartDate}
                               minDate={new Date()}
                               maxDate={estimatedEndDate}
                               onChange={(date: Date) => setRequestedStartDate(date)}
                            />
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Start Date</label>
                            <DatePicker
                                required
                                disabled={userRole != 'Admin'}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText='Click to select a date'
                                selected={startDate}
                                minDate={new Date()}
                                maxDate={estimatedEndDate}
                                onChange={(date: Date) => setStartDate(date)}
                            />
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Estimated End Date</label>
                            <DatePicker
                                required
                                disabled={!startDate || userRole != 'Admin'}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText='Click to select a date'
                                selected={estimatedEndDate}
                                minDate={startDate}
                                onChange={(date: Date) => setEstimatedEndDate(date)}
                            />
                        </div>

                        <div className="col-md-6 mb-4">
                            <label className="form-label">Payment Amount</label>
                            <input
                                disabled={userRole != 'Admin' || (request?.status?.id != 1 && request?.status?.id != 2)}
                                required
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(+e.target.value)}
                                type="number"
                                min={100}
                                step={0.01}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Status</label>
                            <select
                                disabled={userRole != 'Admin'}
                                required
                                value={statusId}
                                onChange={(e) => setStatusId(+e.target.value)}
                                className="form-select"
                            >
                                <option value=""></option>
                                {statusList?.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Company</label>
                            <select
                                disabled={userRole != 'Admin'}
                                required
                                value={companyId}
                                onChange={(e) => setCompanyId(+e.target.value)}
                                className="form-select"
                            >
                                <option value="">No Contractor Selected</option>
                                {companiesList?.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>


                    </div>
                    <div className="row">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="col">
                            <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <input type={'submit'} value="Update" className='btn construction-btn' />
                        </div>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default EditRequest