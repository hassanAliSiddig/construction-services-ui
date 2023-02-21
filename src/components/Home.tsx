import { skipToken } from '@reduxjs/toolkit/dist/query/react'
import React, { useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLogoutQuery } from '../store/authApiSlice'
import { selectUserRole } from '../store/authSlice'
import CreateRequest from './CreateRequest'
import EditRequest from './EditRequest'
import LoadingSpinner, { spinnerReducer } from './LoadingSpinner'
import Requests from './Requests'

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
      <main>
        <Requests />
        <div hidden={userRole != 'Admin'} className="modal fade" id="EditModal" tabIndex={-1} aria-labelledby="EditModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <EditRequest />
            </div>
          </div>
        </div>
        <div hidden={userRole != 'Client'} className="modal fade" id="CreateModal" tabIndex={-1} aria-labelledby="CreateModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <CreateRequest />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
