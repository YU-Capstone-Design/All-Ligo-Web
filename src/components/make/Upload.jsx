import { useState } from 'react'
import erroroutline from '../../assets/make/erroroutline.svg'
import arrowup from '../../assets/arrow-up.svg'
import noicon from '../../assets/auth/noicon.svg'
import TimeModal from './TimeModal'
import Calendar from './Calendar'
import AuthButton from '../auth/AuthButton'
import WeekdaySelector from './WeekdaySelector'

const getScheduleLabel = ({ day, hour, minute }) =>
  `${day}요일 / ${hour}시 ${minute}분`

const Upload = ({ onCreate }) => {
  const [view, setView] = useState('list')
  const [schedules, setSchedules] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [uploadTime, setUploadTime] = useState({
    hour: 0,
    minute: 0,
  })
  const [selectedEndDate, setSelectedEndDate] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isAddActive = selectedDays.length > 0
  const isCreateActive = schedules.length > 0 && !isSubmitting

  const handleToggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((selectedDay) => selectedDay !== day)
        : [...prev, day],
    )
  }

  const handleAddSchedules = () => {
    if (!isAddActive) return

    setSchedules((prev) => [
      ...prev,
      ...selectedDays.map((day) => ({
        id: `${day}-${uploadTime.hour}-${uploadTime.minute}-${Date.now()}-${Math.random()}`,
        day,
        hour: uploadTime.hour,
        minute: uploadTime.minute,
      })),
    ])
    setSelectedDays([])
    setView('list')
  }

  const handleRemoveSchedule = (id) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== id))
  }

  const handleCreateClick = async () => {
    if (!isCreateActive) return

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      await onCreate({
        schedules,
        selectedEndDate,
      })
    } catch (error) {
      setErrorMessage(
        error.response?.status === 401
          ? '로그인이 만료되었어요. 다시 로그인 후 시도해주세요.'
          : error.response?.data?.message ||
              error.message ||
              '홍보물 생성 요청에 실패했어요. 잠시 후 다시 시도해주세요.',
      )
      setIsSubmitting(false)
    }
  }

  const renderScheduleForm = () => (
    <>
      <div className="flex-1 overflow-y-auto px-[16px] pb-[20px] pt-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            언제 업로드를 진행할까요?
          </span>

          <span className="text-[16px] leading-[24px] text-[#7e858c]">
            AI가 키워드에 알맞는 홍보물을 자동으로 생성해요!
          </span>

          <div className="mt-[24px] flex items-center gap-[14px] rounded-[20px] bg-[#e8f3ff] px-[12px] py-[12px]">
            <img src={erroroutline} alt="안내" />
            <span className="text-[14px] leading-[24px] text-[#424950]">
              설정하신 요일과 시간에 맞추어
              <br />
              자동 업로드를 진행해요.
            </span>
          </div>

          <span className="mt-[28px] px-[12px] text-[14px] font-semibold text-[#7e858c]">
            업로드 요일 선택
          </span>

          <div className="mt-[10px]">
            <WeekdaySelector
              selectedDays={selectedDays}
              onToggleDay={handleToggleDay}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsTimeModalOpen(true)}
            className="mt-[20px] flex h-[86px] w-full items-center justify-between rounded-[10px] bg-[#F6F6F8] p-[12px]"
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
              className="h-[24px] w-[24px] rotate-180"
            />
          </button>
        </div>
      </div>

      <div className="shrink-0 px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton isActive={isAddActive} onClick={handleAddSchedules}>
          추가하기
        </AuthButton>
      </div>
    </>
  )

  const renderScheduleList = () => (
    <>
      <div className="flex-1 overflow-y-auto px-[16px] pb-[20px] pt-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            언제 업로드를 진행할까요?
          </span>

          <span className="text-[16px] leading-[24px] text-[#7e858c]">
            설정하신 주기에 맞추어 업로드를 진행할게요!
          </span>
        </div>

        <div className="mt-[28px] flex flex-col gap-[12px]">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex items-center justify-between self-stretch rounded-[10px] bg-[#F6F6F8] py-[18px] pl-[16px] pr-[10px]"
            >
              <span className="font-['Apple_SD_Gothic_Neo'] text-[20px] font-medium leading-[33px] tracking-[-0.5px] text-[#000000]">
                {getScheduleLabel(schedule)}
              </span>

              <button
                type="button"
                onClick={() => handleRemoveSchedule(schedule.id)}
                className="flex h-[25px] w-[25px] items-center justify-center"
              >
                <img className="h-[25px] w-[25px]" src={noicon} alt="삭제" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setView('form')}
            className="flex h-[49px] w-full flex-col items-center justify-center gap-[8px] self-stretch rounded-[10px] bg-[#E8F3FF] px-[16px] py-[8px] text-[24px] leading-[24px] text-[#3182F6]"
          >
            +
          </button>
        </div>
      </div>

      <div className="shrink-0 px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={schedules.length > 0}
          onClick={() => setView('deadline')}
        >
          다음
        </AuthButton>
      </div>
    </>
  )

  const renderDeadline = () => (
    <>
      <div className="flex-1 overflow-y-auto px-[16px] pb-[20px] pt-[12px]">
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold leading-[41px]">
            언제 업로드를 끝낼까요?
          </span>
        </div>

        <span className="mt-[24px] block px-[12px] text-[14px] font-semibold text-[#7e858c]">
          반복 마감 날짜 (선택)
        </span>

        <Calendar
          selectedDate={selectedEndDate}
          onSelectDate={setSelectedEndDate}
        />

        {errorMessage && (
          <p className="mt-[12px] px-[12px] text-[14px] leading-[21px] text-[#ED0404]">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="shrink-0 px-[16px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <AuthButton
          isActive={!!isCreateActive}
          onClick={handleCreateClick}
        >
          {isSubmitting ? '생성 중...' : '생성하기'}
        </AuthButton>
      </div>
    </>
  )

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {view === 'form' && renderScheduleForm()}
      {view === 'list' && renderScheduleList()}
      {view === 'deadline' && renderDeadline()}

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
