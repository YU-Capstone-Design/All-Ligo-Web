import React from 'react'
import AuthButton from '../auth/AuthButton'

const Title = ({ value, onChange, onCreate }) => {
  const isCreateActive = value?.trim().length > 0

  return (
    <div className="relative h-full flex flex-col">
      <div className="px-[16px] mt-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            주간 홍보의 제목을 입력해주세요
          </span>
        </div>

        <div className="mt-[30px] flex w-full h-[86px] flex-col items-start gap-[8px] rounded-[10px] bg-[#F6F6F8] p-[12px]">
          <label className="text-[16px] leading-[22px] text-[#7E858C] font-semibold">
            제목
          </label>

          <input
            value={value}
            onChange={onChange}
            placeholder="ex) 우리가게 레모네이드 광고"
            className="w-full bg-transparent text-[16px] leading-[33px] text-[#000000] placeholder:text-[#B4BAC0] outline-none"
          />
        </div>
      </div>

      <div className="mt-auto px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={isCreateActive}
          onClick={onCreate}
        >
          생성하기
        </AuthButton>
      </div>
    </div>
  )
}

export default Title