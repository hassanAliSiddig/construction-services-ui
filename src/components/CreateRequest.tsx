import { nanoid } from '@reduxjs/toolkit';
import { FormEvent, useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetConstructionCompaniesListQuery, useGetConstructionRequestsQuery, useGetCurrentClientQuery, useSubmitConstructionRequestMutation, useUpdateConstructionRequestMutation } from '../api/constructionApiSlice';
import { selectCurrentUser, selectDecryptedToken, selectUserRole } from '../store/authSlice';
import { selectToBeEditedRequest, setConstructionRequestsList } from '../store/constructionSlice';
import LoadingSpinner from './LoadingSpinner';

type Props = {}

const CreateRequest = (props: Props) => {
    
    const closeModalRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate()
    
    const [errorMsg, setErrorMsg] = useState('')
    const decryptedToken = useSelector(selectDecryptedToken)
    const username = useSelector(selectCurrentUser)

    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [requestedStartDate, setRequestedStartDate] = useState<Date>(new Date())
    const [projectAddress, setProjectAddress] = useState('')

    const {
        data: currentClient,
        isLoading: isGetCurrentClientLoading
    } = useGetCurrentClientQuery(decryptedToken?.userId, { skip: !decryptedToken?.userId })

    const [submitRequest, { isLoading }] = useSubmitConstructionRequestMutation()

    const createRequest = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let requestBody = {
            projectName,
            description,
            requestedStartDate: requestedStartDate.toJSON(),
            client: currentClient,
            status: {
                "id": 1,
                "name": "Submitted"
              },
            projectAddress,
            addedBy:username,
            addedOn: new Date(),
            paymentOrderId: projectName + ' (' + nanoid(6) +')'
        }

        try {
            let response = await submitRequest(requestBody).unwrap()
            navigate('/')
        } catch (error) {
            console.log(error)
            alert('The create request failed')
        } finally {
            closeModalRef?.current?.click()
        }
    }

    if (isLoading) {
        return (<LoadingSpinner display={true}></LoadingSpinner>)
    }

    return (
        <section className="card">
            <div className="card-header">
                <h6 className="card-title">Create Construction Request Form</h6>
            </div>
            <div className="card-body">
                <form onSubmit={e => createRequest(e)}>
                    <div className='row'>
                        
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Project Name</label>
                            <input
                                placeholder='Please enter your project name here'
                                required
                                type={'text'}
                                className="form-control"
                                value={projectName}
                                onChange={e => setProjectName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className="form-label">Description</label>
                            <textarea
                                placeholder='Please enter the exact description of the construction requirements'
                                required
                                className="form-control"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="col-md-12 mb-4">
                            <label className="form-label">Project Address</label>
                            <input
                                required
                                type={'text'}
                                className="form-control"
                                placeholder='Building, Street, City, Country'
                                value={projectAddress}
                                onChange={e => setProjectAddress(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label">Requested Start Date</label>

                            <DatePicker
                                required
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                placeholderText='Click to select a date'
                                selected={requestedStartDate}
                                minDate={new Date()}
                                onChange={(date: Date) => setRequestedStartDate(date)}
                            />

                        </div>
                    </div>
                    <div className="row">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className="col">
                            <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <input type={'submit'} value="Submit" className='btn construction-btn' />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default CreateRequest