import React from 'react'
import { useNavigate } from 'react-router-dom'
import arrowup from '../../assets/arrow-up.svg'

const MakeHeader = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-row items-center py-[11px]">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="pl-[16px]"
      >
        <img src={arrowup} alt="뒤로가기" />
      </button>

      <div className="text-[14px] w-[314px] leading-[20px] text-center flex justify-center">
        홍보물 생성
      </div>
    </div>
  )
}

export default MakeHeader