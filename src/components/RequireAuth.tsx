import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useLoginMutation, useRefreshTokenQuery } from '../store/authApiSlice'
import { selectCurrentToken, setCredentials } from '../store/authSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const RequireAuth = (props: Props) => {
  const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem('persist') || 'false'))

  let token = useSelector(selectCurrentToken)
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error
  } = useRefreshTokenQuery(undefined, { skip: !!token || persist === false })
  const location = useLocation()

  const dispatch = useDispatch()

  useEffect(() => {
    if (!isLoading && !!data) {
      dispatch(setCredentials({ user: null, accessToken: data?.token }))
    }
  },[dispatch, data])

  if(isLoading) {
    return <LoadingSpinner display={true}></LoadingSpinner>
  }

  return (
    (!!token || !!data)
      ? <Outlet />
      : <Navigate to="/login" state={{ from: location }} replace />

  )
}

export default RequireAuth