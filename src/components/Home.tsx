import { skipToken } from '@reduxjs/toolkit/dist/query/react'
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useLogoutQuery } from '../api/authApiSlice'
import { useGetConstructionRequestStatusListQuery } from '../api/constructionApiSlice'
import { selectUserRole } from '../store/authSlice'
import { selectStatusList } from '../store/constructionSlice'
import CreateRequest from './CreateRequest'
import EditRequest from './EditRequest'
import LoadingSpinner, { spinnerReducer } from './LoadingSpinner'
import PaymentPage from './PaymentPage'
import Requests from './Requests'
import Unauthorized from './Unauthorized'

type Props = {}

const Home = (props: Props) => {
  const navigate = useNavigate()
  const [spinnerArray, spinnerDispatcher] = useReducer(spinnerReducer, []);
  const [shouldLogout, setShouldLogout] = useState(true)

  const userRole = useSelector(selectUserRole)

  const { data, isLoading } = useLogoutQuery(undefined, { skip: shouldLogout })

  const signOut = async () => {
    try {
      spinnerDispatcher(signOut.name)
      setShouldLogout(false)

    } finally {

      spinnerDispatcher(signOut.name)
      navigate('/login', { state: { from: location } })
    }
  }
  return (
    <>
      <LoadingSpinner display={spinnerArray.length > 0}></LoadingSpinner>
      <nav className="navbar header-color">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="construction-logo bi bi-cone-striped">&nbsp; Construction Services</i>
          </a>
          <span onClick={() => signOut()}>

            <i style={{ fontSize: '1.5rem', cursor: 'pointer' }} className="bi bi-box-arrow-right construction-color"></i>
          </span>
        </div>
      </nav>
      <br />
      <main className='container-fluid'>
        <Routes>
          <Route path={`/*`} element={<Requests />} />
          <Route path={`/create-request`} element={userRole === 'Client' ? <CreateRequest /> : <Unauthorized />} />
        </Routes>
        <div className="modal fade modal-lg" id="EditModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="EditModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <EditRequest />
            </div>
          </div>
        </div>
        <div className="modal fade modal-lg" id="PaymentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="PaymentModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <PaymentPage />
            </div>
          </div>
        </div>

      </main>
    </>
  )
}

export default Home
