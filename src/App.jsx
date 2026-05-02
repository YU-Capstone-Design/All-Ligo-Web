import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import GlobalLayout from './layout/GlobalLayout'
import Splash from './pages/Splash'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<Splash />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App