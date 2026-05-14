import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import erroroutline from '../../assets/make/erroroutline.svg'
import arrowup from '../../assets/arrow-up.svg'
import TimeModal from './TimeModal'
import Calendar from './Calendar'
import AuthButton from '../auth/AuthButton'

const Upload = () => {
  const navigate = useNavigate()

  const [selectedDay, setSelectedDay] = useState(null)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [uploadTime, setUploadTime] = useState({
    hour: 0,
    minute: 0,
  })

  const [selectedEndDate, setSelectedEndDate] = useState(null)

  const isCreateActive = selectedDay && selectedEndDate

  const BaseDateStyle =
    'h-[63px] px-[12px] py-[8px] border rounded-[10px] text-center justify-center items-center flex text-[16px] leading-[33px] outline-none w-full cursor-pointer'

  const getDateStyle = (day, colorClass = 'text-[#000000]') => {
    const isSelected = selectedDay === day

    return `
      ${BaseDateStyle}
      ${colorClass}
      ${
        isSelected
          ? 'border-[#3182F6] bg-[#C9E2FF]'
          : 'border-[#f6f6f8] bg-[#f6f6f8]'
      }
    `
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="px-[16px] mt-[12px] flex-1 overflow-y-auto pb-[20px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            언제 업로드를 진행할까요?
          </span>

          <div className="flex gap-[14px] items-center mt-[18px] px-[12px] py-[12px] bg-[#e8f3ff] border-[#e8f3ff] rounded-[20px]">
            <img src={erroroutline} alt="안내" />
            <span className="text-[14px] leading-[24px] text-[#424950]">
              해당 게시글 생성은 1-2시간이 소요되므로 현재 시간부터
              <br />
              1시간 뒤 시간부터 설정 가능합니다.
            </span>
          </div>

          <span className="text-[14px] font-semibold mt-[20px] text-[#7e858c] px-[12px]">
            업로드 요일 선택
          </span>

          <div className="flex gap-[8px]">
            <button
              type="button"
              onClick={() => setSelectedDay('월')}
              className={getDateStyle('월')}
            >
              월
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay('화')}
              className={getDateStyle('화')}
            >
              화
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay('수')}
              className={getDateStyle('수')}
            >
              수
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay('목')}
              className={getDateStyle('목')}
            >
              목
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay('금')}
              className={getDateStyle('금')}
            >
              금
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay('토')}
              className={getDateStyle('토', 'text-[#3182f6]')}
            >
              토
            </button>

            <button
              type="button"
              onClick={() => setSelectedDay('일')}
              className={getDateStyle('일', 'text-[#ed0404]')}
            >
              일
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsTimeModalOpen(true)}
            className="mt-[20px] flex h-[86px] mb-[20px] w-full items-center justify-between rounded-[10px] bg-[#F6F6F8] p-[12px]"
          >
            <div className="flex flex-col gap-[8px] text-left">
              <span className="text-[14px] font-semibold leading-[21px] text-[#7E858C]">
                시간 선택
              </span>

              <span className="text-[24px] font-normal leading-[33px] text-[#000000]">
                {uploadTime.hour}시 {uploadTime.minute}분
              </span>
            </div>

            <img
              src={arrowup}
              alt="시간 선택"
              className="w-[24px] h-[24px] rotate-180"
            />
          </button>
        </div>

        <span className="px-[12px] text-[#7e858c] font-semibold text-[14px]">
          반복 마감 날짜 선택
        </span>

        <Calendar
          selectedDate={selectedEndDate}
          onSelectDate={setSelectedEndDate}
        />
      </div>

      <div className="px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={!!isCreateActive}
          onClick={() => navigate('/makecomplete')}
        >
          생성하기
        </AuthButton>
      </div>

      <TimeModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onConfirm={(hour, minute) => {
          setUploadTime({
            hour,
            minute,
          })
        }}
      />
    </div>
  )
}

export default Upload