import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { registerLocale, setDefaultLocale } from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import enGB from 'date-fns/locale/en-GB'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Unauthorized from './components/Unauthorized'
import RequireAuth from './components/RequireAuth'
import Home from './components/Home'

registerLocale('en-GB', enGB)
setDefaultLocale('en-GB');

function App() {
  return (
    <>
    {/* <img className='login-background-image' src="background.jpg" alt="cover" /> */}
    <Routes>
        <Route path={`/login`} element={<Login />} />
        <Route path={`/unauthorized`} element={<Unauthorized />} />
        {/* <Route element={<PersistLogin />}> */}
          <Route element={<RequireAuth />} >
            <Route path={`/*`} element={<Home />} />
          </Route>
        {/* </Route> */}
      </Routes>
    </>
  )
}

export default App
