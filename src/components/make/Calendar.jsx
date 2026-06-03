import { useMemo, useState } from 'react'
import arrowup from '../../assets/arrow-up.svg'

const Calendar = ({ selectedDate, onSelectDate }) => {
  const today = new Date()
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const calendarDates = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const firstDayIndex = firstDay.getDay()
    const lastDate = lastDay.getDate()

    const prevMonthLastDate = new Date(year, month, 0).getDate()

    const dates = []

    // 이전 달 날짜
    for (let i = firstDayIndex - 1; i >= 0; i -= 1) {
      dates.push({
        date: prevMonthLastDate - i,
        isCurrentMonth: false,
        fullDate: new Date(year, month - 1, prevMonthLastDate - i),
      })
    }

    // 이번 달 날짜
    for (let i = 1; i <= lastDate; i += 1) {
      dates.push({
        date: i,
        isCurrentMonth: true,
        fullDate: new Date(year, month, i),
      })
    }

    // 다음 달 날짜
    const nextMonthDateCount = 42 - dates.length

    for (let i = 1; i <= nextMonthDateCount; i += 1) {
      dates.push({
        date: i,
        isCurrentMonth: false,
        fullDate: new Date(year, month + 1, i),
      })
    }

    return dates
  }, [year, month])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isSameDate = (dateA, dateB) => {
    if (!dateA || !dateB) return false

    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    )
  }

  const isBeforeToday = (date) => {
    const dateStart = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    )

    return dateStart < todayStart
  }

  const getDateColor = (dateItem, index) => {
    const dayIndex = index % 7

    if (!dateItem.isCurrentMonth) {
      return 'text-[#B4BAC0]'
    }

    if (dayIndex === 0) {
      return 'text-[#3182F6]'
    }

    if (dayIndex === 6) {
      return 'text-[#ED0404]'
    }

    return 'text-[#000000]'
  }

  return (
    <div className="mt-[10px] w-full rounded-[10px] border-[2px] border-[#F6F6F8] bg-white p-[12px]">
      <div className="flex h-[36px] items-center justify-center gap-[12px]">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-[24px] w-[24px] items-center justify-center"
        >
          <img
            src={arrowup}
            alt="이전 달"
            className="h-[20px] w-[20px]"
          />
        </button>

        <span className="text-[20px] font-semibold leading-[20px] text-[#000000]">
          {year}.{String(month + 1).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-[24px] w-[24px] items-center justify-center"
        >
          <img
            src={arrowup}
            alt="다음 달"
            className="h-[20px] w-[20px] rotate-180"
          />
        </button>
      </div>

      <div className="mt-[9px] grid grid-cols-7 gap-y-[22px]">
        {calendarDates.map((dateItem, index) => {
          const isSelected = isSameDate(selectedDate, dateItem.fullDate)
          const isDisabled = isBeforeToday(dateItem.fullDate)

          return (
            <button
              key={`${dateItem.fullDate.toISOString()}-${index}`}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateItem.fullDate)}
              className={`flex h-[24px] items-center justify-center ${
                isDisabled ? 'cursor-not-allowed' : ''
              }`}
            >
              <span
                className={`flex h-[48px] w-[48px] items-center justify-center rounded-[10px] text-[16px] leading-[24px] ${
                  isSelected
                    ? 'bg-[#C9E2FF] border-[#3182f6] border-[1px]'
                    : isDisabled
                      ? 'text-[#CAD0D6]'
                      : getDateColor(dateItem, index)
                }`}
              >
                {dateItem.date}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Calendar
