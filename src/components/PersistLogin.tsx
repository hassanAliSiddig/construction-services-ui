import { skipToken } from '@reduxjs/toolkit/dist/query/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRefreshTokenQuery } from '../store/authApiSlice'
import { setCredentials } from '../store/authSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const PersistLogin = (props: Props) => {
    const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem('persist') || 'false'))

    if (persist === false) {
        return (<Outlet />)
    }

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useRefreshTokenQuery({})

    const dispatch = useDispatch()

    if (!isLoading && !!data) {
        dispatch(setCredentials({ user: null, accessToken: data?.token }))
    }

    console.log('from refresh Token  ', data?.token)

    return (
        isLoading
            ? <LoadingSpinner display={true}></LoadingSpinner>
            : <Outlet />
    )
}

export default PersistLogin