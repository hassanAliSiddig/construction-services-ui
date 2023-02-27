import { nanoid } from '@reduxjs/toolkit'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLazyValidateCreditCardQuery, useUpdateConstructionRequestMutation } from '../api/constructionApiSlice'
import { selectCurrentUser, selectDecryptedToken } from '../store/authSlice'
import { selectToBeEditedRequest, setToBeEditedRequest } from '../store/constructionSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const PaymentPage = (props: Props) => {

    let requestFromStore = useSelector(selectToBeEditedRequest)

    
    const closeModalRef = useRef<HTMLButtonElement>(null)
    const navigate = useNavigate()
    
    const [errorMsg, setErrorMsg] = useState('')
    
    const [request, setRequest] = useState<any>(null)
    const [nameOnCreditCard, setNameOnCreditCard] = useState('')
    const [creditCardNumber, setCreditCardNumber] = useState('')
    const [expirationDate, setExpirationDate] = useState('')
    const [cvc, setCvc] = useState('')
    const [otp, setOtp] = useState('')
    const [showOtpForm, setShowOtpForm] = useState(false)

    const dispatch = useDispatch()
    const [validatePayment, { isLoading: isPaymentValidationLoading }] = useLazyValidateCreditCardQuery()
    const [updateRequest, { isLoading: isUpdateRequestLoading }] = useUpdateConstructionRequestMutation()


    useEffect(() => {
        if (!requestFromStore?.id) {
            return
        }
        setRequest(requestFromStore)
    }, [requestFromStore?.id])


    const makePayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let requestBody = {
            nameOnCreditCard, 
            creditCardNumber,
            expirationDate,
            cvc,
            otp
        }
        try {
            let response = await validatePayment(requestBody).unwrap()
            if (response == true) {
                let updatedRequest = {
                    ...request,
                    paymentDate: new Date().toJSON(),
                    paymentAuthCode: Math.floor(Math.random() * 1000000),
                    status: {
                        "id": 3,
                        "name": "Payment Successful"
                    }
                }
                await updateRequest(updatedRequest).unwrap()
                setCreditCardNumber('')
                setExpirationDate('')
                setOtp('')
                setCvc('')
                setNameOnCreditCard('')

                return alert(`Your payment for order: ${updatedRequest.paymentOrderId} was successful,
                amount: ${updatedRequest.paymentAmount} AED,
                authorization code: ${updatedRequest.paymentAuthCode}`)
                
            }
            return alert(`Your payment for order: ${request.paymentOrderId} was unsuccessful,
            please check your card details and try again`)

        } catch (error) {
            console.log(error)
            alert('The update request failed')
        } finally {
            setShowOtpForm(false)
            closeModalRef?.current?.click()
        }
    }

    return (
        <>
            <LoadingSpinner display={isPaymentValidationLoading}></LoadingSpinner>
            <section className="card">
                <div className="card-header">
                    <h6 className="card-title">Payment For Request {request?.id}</h6>
                </div>
                <div className="card-body">
                    <form hidden={showOtpForm} onSubmit={e => {
                        e.preventDefault()
                        setShowOtpForm(true)
                    }}>
                        <div className='row'>
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Order Id</label>
                                <input
                                    placeholder='Please enter the exact description of the construction requirements'
                                    disabled
                                    type='tex'
                                    className="form-control"
                                    defaultValue={request?.paymentOrderId}
                                />
                            </div>
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Name On The Card</label>
                                <input
                                    required
                                    type={'text'}
                                    className="form-control"
                                    placeholder='Enter Card Number'
                                    value={nameOnCreditCard}
                                    onChange={e => setNameOnCreditCard(e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Credit Card Number</label>
                                <input
                                    required
                                    maxLength={16}
                                    minLength={16}
                                    step={1}
                                    type={'number'}
                                    className="form-control"
                                    placeholder='Enter Card Number'
                                    value={creditCardNumber}
                                    onChange={e => setCreditCardNumber(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="form-label">Expiration Date</label>
                                <input
                                    required
                                    type={'text'}
                                    maxLength={5}
                                    className="form-control"
                                    placeholder='MM/YY'
                                    value={expirationDate}
                                    onChange={e => {
                                        let value = e.target.value
                                        if (value.length === 2) {
                                            value = value + '/'
                                        }
                                        else if (value.length === 3 && value.charAt(2) === '/') {
                                            value = value.replace('/', '');
                                        }
                                        setExpirationDate(value)
                                    }}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <label className="form-label">CVC</label>
                                <input
                                    required
                                    type={'text'}
                                    className="form-control"
                                    placeholder='Enter Card Number'
                                    value={cvc}
                                    onChange={e => setCvc(e.target.value)}
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
                    <form hidden={!showOtpForm} onSubmit={e => makePayment(e)}>
                        <div className='row'>
                            <div className="col-md-12 mb-4">
                                <label className="form-label">Please Enter OTP</label>
                                <input
                                    required
                                    type={'text'}
                                    className="form-control"
                                    placeholder='Enter Card Number'
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
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
        </>
    )
}

export default PaymentPage