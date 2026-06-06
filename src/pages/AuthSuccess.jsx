import React from 'react'
import blueCheck from '../assets/blue-check.svg'

const AuthSuccess = () => {
  return (
    <main className='flex h-full flex-col items-center justify-center bg-white px-[25px] pb-[80px]'>
      <img
        className='h-[125px] w-[125px]'
        src={blueCheck}
        alt='인증 성공'
      />

      <span className='mt-[28px] text-center font-["Apple_SD_Gothic_Neo"] text-[24px] font-bold leading-[34px] tracking-[-0.5px] text-[var(--common-b,#000)]'>
        인증 성공
      </span>

      <span className='mt-[14px] text-center font-["Apple_SD_Gothic_Neo"] text-[16px] font-medium leading-[16px] tracking-[-0.5px] text-[var(--coolgray-500,#7E858C)]'>
        올리고 앱으로 이동해주세요!
      </span>
    </main>
  )
}

export default AuthSuccess
