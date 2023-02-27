import React, { FormEvent, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLazyLoginQuery } from '../api/authApiSlice'
import { setCredentials } from '../store/authSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {pageFor: 'Admin' | 'Client'}

const Login = (props: Props) => {
  const userRef = useRef<any>()
  const errorRef = useRef<any>()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem('persist') || 'false'))
  const navigate = useNavigate()

  const [login, { isLoading }] = useLazyLoginQuery()
  const dispatch = useDispatch()

  useEffect(() => {
    userRef.current?.focus()
  }, [])

  useEffect(() => {
    setErrorMsg('')
  }, [username, password])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    localStorage.setItem('persist', JSON.stringify(persist))

    try {
      const response = await login({ username, password }).unwrap()

      const userData = response[0]
      
      if(persist) {
        localStorage.setItem('accessToken', userData.token)
      }

      dispatch(setCredentials({ accessToken: userData.token, user: username }))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error: any) {
      if (!error?.originalStatus) {
        setErrorMsg('Can not sign you in at this time, \n please try again later')
      } else if (error.originalStatus === 400) {
        setErrorMsg('Missing username or password')
      } else if (error.originalStatus === 401 || error.response === 403) {
        setErrorMsg('Unauthorized')
      } else {
        setErrorMsg('Login failed')
      }

      errorRef.current.focus()
    }
  }

  const content =
    <>
      <img className='login-background-image' src="/construction/background.jpg" alt="raknic-logo" />

      <LoadingSpinner display={isLoading}></LoadingSpinner>
      <section className='container-fluid login-form'>

        <div className="row justify-content-center">
          <div className="col-md-6 col-sm-12 rounded py-3" style={{ backgroundColor: 'rgb(255,255,255,0.8)' }}>
            <div className="row mb-3">
              <div className="col-md-12 text-center">
                <div className='construction-logo-main'>

                  <i className="bi bi-cone-striped"></i>
                  <p>Construction Services</p>
                </div>
              </div>
            </div>
            <br />
            <div className="col-md-12">
              <div hidden={!errorMsg} className="alert alert-danger text-center" role="alert">
                {errorMsg}
              </div>
            </div>
            <div className="row mb-5">

            </div>
            <form onSubmit={(e) => handleSubmit(e)} className="row g-3 p-md-2 p-lg-2">
              <div className="col-md-12">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  ref={userRef}
                  required
                  autoComplete="true"
                  type="text" className="form-control" />
              </div>
              <div className="col-md-12">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  className="form-control" />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input id="remember-me" checked={persist} onChange={e => setPersist(e.target.checked)} className="form-check-input remember-me" type="checkbox" />
                  <label htmlFor='remember-me' className="form-check-label"> Remember me </label>
                </div>
              </div>
              <div className="col-12 text-center">
                <input type="submit" className="btn construction-btn btn-block mb-4 w-80" value={'Sign In'} />
              </div>
            </form>
          </div>
        </div>
      </section>
    </>

  return content
}

export default Login