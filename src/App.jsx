import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GlobalLayout from './layout/GlobalLayout'
import Splash from './pages/Splash'
import Login from './pages/Login'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App