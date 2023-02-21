import { FormEvent, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import {  useGetConstructionRequestsQuery, useUpdateConstructionRequestMutation } from '../store/constructionApiSlice';
import { selectToBeEditedRequest, setConstructionRequestsList } from '../store/constructionSlice';
import LoadingSpinner from './LoadingSpinner';

type Props = {}

const EditRequest = (props: Props) => {

    const [startDate, setStartDate] = useState<Date>()
    const [estimatedEndDate, setEstimatedEndDate] = useState<Date>()
    const [paymentAmount, setPaymentAmount] = useState<number>(0)

    const closeModalRef = useRef<HTMLButtonElement>(null)

    let request = useSelector(selectToBeEditedRequest)
    const [updateRequest, { isLoading }] = useUpdateConstructionRequestMutation()

    const submitUpdateRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let requestBody = {
            constructionRequestID: request.constructionRequestID,
            startDate: startDate?.toJSON(),
            estimatedEndDate: estimatedEndDate?.toJSON(),
            paymentAmount
        }

        try {

            let response = await updateRequest(requestBody).unwrap()

        } catch (error) {
            console.log(error)
            alert('The update request failed')
        } finally {
            closeModalRef?.current?.click()
            window.location.reload()
        }
    }

    if (isLoading) {
        return (<LoadingSpinner display={true}></LoadingSpinner>)
    }

    return (
        <section className="card">
            <div className="card-header">
                <h6 className="card-title">Edit Request Form (Request ID = {request?.constructionRequestID})</h6>
            </div>
            <div className="card-body">
                <form onSubmit={e => submitUpdateRequest(e)}>
                    <div className='row'>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Start Date</label>

                            <DatePicker
                                required
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText='Click to select a date'
                                selected={startDate}
                                onChange={(date: Date) => setStartDate(date)}
                            />

                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Estimated End Date</label>
                            <DatePicker
                                required
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText='Click to select a date'
                                selected={estimatedEndDate}
                                onChange={(date: Date) => setEstimatedEndDate(date)}
                            />
                        </div>

                        <div className="col-md-6 mb-4">
                            <label className="form-label">Payment Amount</label>
                            <input
                                required
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(+e.target.value)}
                                type="number"
                                min={100}
                                step={0.01}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="col">
                            <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <input type={'submit'} style={{ backgroundColor: '#3F3F3F' }} value="Update" className='btn btn-secondary' />
                        </div>
                    </div>
                </form>
            </div>
        </section>

    )
}

export default EditRequest