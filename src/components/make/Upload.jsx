import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import erroroutline from '../../assets/make/erroroutline.svg'
import arrowup from '../../assets/arrow-up.svg'
import TimeModal from './TimeModal'
import Calendar from './Calendar'
import AuthButton from '../auth/AuthButton'
import WeekdaySelector from './WeekdaySelector'

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

          <WeekdaySelector
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />

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
