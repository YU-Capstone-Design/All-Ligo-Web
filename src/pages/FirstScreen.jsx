import React from 'react'
import ligoicon from '../assets/ligoicon.svg'
import ligoname from '../assets/ligoname.svg'
const FirstScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[24.92px]">
        <img src={ligoicon}/>
        <img src={ligoname}/>
    </div>
  )
}

export default FirstScreen