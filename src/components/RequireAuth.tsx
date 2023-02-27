import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useLazyLoginQuery, useRefreshTokenQuery } from '../api/authApiSlice'
import { selectCurrentToken, setCredentials } from '../store/authSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const RequireAuth = (props: Props) => {

  let token = useSelector(selectCurrentToken)
  
  const location = useLocation()

  return (
    (!!token)
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />

  )
}

export default RequireAuth