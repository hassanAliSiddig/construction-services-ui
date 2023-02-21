import React, { FormEvent, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../store/authApiSlice'
import { setCredentials } from '../store/authSlice'
import LoadingSpinner from './LoadingSpinner'

type Props = {}

const Login = (props: Props) => {
  const userRef = useRef<any>()
  const errorRef = useRef<any>()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [persist, setPersist] = useState<boolean>(JSON.parse(localStorage.getItem('persist') || 'false'))
  const navigate = useNavigate()

  const [login, { isLoading }] = useLoginMutation()
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
      const userData = await login({ username, password }).unwrap()
      console.log(userData)

      dispatch(setCredentials({ accessToken: userData.token, user: username }))

      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error: any) {
      if (!error?.originalStatus) {
        setErrorMsg('No response from the server')
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

  const content = isLoading ? <LoadingSpinner display={true}></LoadingSpinner> : (
    <section className='container-fluid login-form'>
      <form onSubmit={(e) => handleSubmit(e)}>

        <div className="row mb-3">
          <div className="col-md-12" style={{ textAlign: 'center' }}>
            <i className="construction-logo-main bi bi-cone-striped">&nbsp; Construction Services</i>

          </div>
        </div>
        <br />
        <div style={{ textAlign: 'center' }} hidden={!errorMsg} className="alert alert-danger" role="alert">
          {errorMsg}
        </div>
        <div className="row">
          <div className="col-md-12 mb-4">
            <label htmlFor='username' className="form-label">Username</label>
            <input
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={userRef}
              required
              autoComplete="true"
              type="text" className="form-control" />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-4">
            <label htmlFor='password' className="form-label">Password</label>
            <input
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="form-control" />
          </div>
        </div>


        <div className="row mb-4">
          <div className="col-md-4">
            <div className="form-check">
              <input checked={persist} onChange={e => setPersist(e.target.checked)} className="form-check-input remember-me" type="checkbox" />
              <label className="form-check-label"> Remember me </label>
            </div>
          </div>
          <div className="col-md-8" style={{ textAlign: 'end' }}>
            <input type="submit" style={{ backgroundColor: '#3F3F3F' }} className="btn btn-secondary btn-block mb-4" value={'Sign In'} />
          </div>
        </div>
      </form>
    </section>

  )

  return content
}

export default Login