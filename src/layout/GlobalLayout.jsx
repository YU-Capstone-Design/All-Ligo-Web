import React from 'react'
import { Outlet } from 'react-router-dom'

const GlobalLayout = () => {
  return (
    // 최대 너비 600px 제한
    <div className="min-h-screen bg-[#000000]">
      <div className="mx-auto min-h-screen w-full max-w-[600px] bg-white">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default GlobalLayout