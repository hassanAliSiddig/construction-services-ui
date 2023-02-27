import { skipToken } from '@reduxjs/toolkit/dist/query/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRefreshTokenQuery } from '../api/authApiSlice'
import { setCredentials } from '../store/authSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const PersistLogin = (props: Props) => {
    let persist = JSON.parse(localStorage.getItem('persist') || 'false')

    if (persist === false) {
        return (<Outlet />)
    }

    const token = localStorage.getItem('accessToken')

    if(!token) {
        return <Outlet></Outlet>
    }

    const dispatch = useDispatch()

    dispatch(setCredentials({ accessToken:token  }))

    return <Outlet></Outlet>
}

export default PersistLogin