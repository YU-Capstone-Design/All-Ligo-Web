import React from 'react'
import { Outlet } from 'react-router-dom'

const GlobalLayout = () => {
  return (
    <div className="min-h-screen bg-[#9c9c9c] flex justify-center">
      <div className="relative w-full max-w-[430px] h-[100dvh] bg-white overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default GlobalLayout