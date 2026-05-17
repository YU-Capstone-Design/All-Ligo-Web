import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ligoicon from '../assets/ligoicon.svg'
import ligoname from '../assets/ligoname.svg'

const FirstScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/thumbnail')
    }, 1000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[24.92px]">
      <img src={ligoicon} />
      <img src={ligoname} />
    </div>
  )
}

export default FirstScreen