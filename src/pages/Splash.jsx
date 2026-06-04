import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import colorpeople from '../assets/auth/colorpeople.svg'
import buildingstore from '../assets/auth/buildingstore.svg'
import AuthButton from '../components/auth/AuthButton'

const Splash = () => {
  const [selectedUserType, setSelectedUserType] = useState(null)
  const navigate = useNavigate()

  const textstyle = "text-[20px] leading-[36px] font-semibold text-center"

  const handleStart = () => {
    if (selectedUserType === 'owner') {
      navigate('/owner-login')
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#f6f6f8] flex flex-col">
      <div className="leading-[36px] text-[24px] font-bold pt-[53px] px-[32px]">
        어떤 유형의 사용자인가요?
      </div>

      <div className="flex justify-center gap-[28px] mt-[24px] px-[32px]">
        <button
          type="button"
          onClick={() => setSelectedUserType('user')}
          className={`
            w-[174px] h-[229px]
            flex flex-col justify-center items-center
            rounded-[15px]
            border transition-all

            ${selectedUserType === 'user'
              ? 'border-2 border-[#2880EB] bg-[#E4F0FF] opacity-100'
              : selectedUserType !== null
                ? 'border border-white bg-white opacity-30'
                : 'border border-white bg-white opacity-100'
            }
          `}
        >
          <img src={colorpeople} className="w-[90px] h-[90px]" />
          <span className={`${textstyle} mt-[25px]`}>일반 사용자</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedUserType('owner')}
          className={`
            w-[174px] h-[229px]
            flex flex-col justify-center items-center
            rounded-[15px]
            border transition-all

            ${selectedUserType === 'owner'
              ? 'border-2 border-[#2880EB] bg-[#E4F0FF] opacity-100'
              : selectedUserType !== null
                ? 'border border-white bg-white opacity-30'
                : 'border border-white bg-white opacity-100'
            }
          `}
        >
          <img src={buildingstore} className="w-[90px] h-[90px]" />
          <span className={`${textstyle} mt-[25px]`}>소상공인</span>
        </button>
      </div>

      <div className="mt-auto px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={selectedUserType !== null}
          onClick={handleStart}
        />
      </div>
    </div>
  )
}

export default Splash
