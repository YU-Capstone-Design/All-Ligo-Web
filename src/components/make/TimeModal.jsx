import { useEffect, useMemo, useRef, useState } from 'react'
import AuthButton from '../auth/AuthButton'

const ITEM_HEIGHT = 36
const VISIBLE_HEIGHT = 252
const LOOP_COUNT = 5
const MIDDLE_LOOP_INDEX = Math.floor(LOOP_COUNT / 2)
const formatMinute = (minute) => String(minute).padStart(2, '0')

const getMiddleIndexByValue = (list, value) => {
  const valueIndex = list.indexOf(value)

  if (valueIndex < 0) return 0

  return MIDDLE_LOOP_INDEX * list.length + valueIndex
}

const scrollToValue = (ref, list, value) => {
  if (!ref.current) return

  const targetIndex = getMiddleIndexByValue(list, value)
  ref.current.scrollTop = targetIndex * ITEM_HEIGHT
}

const normalizeIndex = (index, length) => {
  return ((index % length) + length) % length
}

const TimeModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedHour, setSelectedHour] = useState(7)
  const [selectedMinute, setSelectedMinute] = useState(17)

  const hourRef = useRef(null)
  const minuteRef = useRef(null)

  const hours = useMemo(
    () => Array.from({ length: 23 }, (_, index) => index + 1),
    [],
  )

  const minutes = useMemo(
    () => Array.from({ length: 60 }, (_, index) => index),
    [],
  )

  const loopHours = useMemo(
    () => Array.from({ length: LOOP_COUNT }, () => hours).flat(),
    [hours],
  )

  const loopMinutes = useMemo(
    () => Array.from({ length: LOOP_COUNT }, () => minutes).flat(),
    [minutes],
  )

  const paddingCount = Math.floor(VISIBLE_HEIGHT / ITEM_HEIGHT / 2)

  const handleLoopScroll = (ref, list, setValue) => {
    if (!ref.current) return

    const scrollTop = ref.current.scrollTop
    const currentIndex = Math.round(scrollTop / ITEM_HEIGHT)
    const normalizedIndex = normalizeIndex(currentIndex, list.length)
    const selectedValue = list[normalizedIndex]

    setValue(selectedValue)

    const minSafeIndex = list.length
    const maxSafeIndex = list.length * (LOOP_COUNT - 1)

    if (currentIndex < minSafeIndex || currentIndex >= maxSafeIndex) {
      const resetIndex = MIDDLE_LOOP_INDEX * list.length + normalizedIndex

      requestAnimationFrame(() => {
        if (!ref.current) return
        ref.current.scrollTop = resetIndex * ITEM_HEIGHT
      })
    }
  }

  const handleConfirm = () => {
    onConfirm(selectedHour, selectedMinute)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return

    setTimeout(() => {
      scrollToValue(hourRef, hours, selectedHour)
      scrollToValue(minuteRef, minutes, selectedMinute)
    }, 0)
  }, [isOpen, hours, minutes, selectedHour, selectedMinute])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[430px] rounded-t-[20px] bg-white px-[16px] pt-[22px] pb-[calc(18px+env(safe-area-inset-bottom))]">
        <div className="relative h-[252px] overflow-hidden">
          <div className="pointer-events-none absolute left-0 top-[108px] z-10 h-[36px] w-full rounded-[100px] bg-[#E4F0FE]" />

          <div className="relative z-20 grid h-full w-full grid-cols-2 px-[72px]">
            <div className="flex h-full items-center justify-center">
              <div className="flex w-[120px] items-center justify-center gap-[20px]">
                <div
                  ref={hourRef}
                  onScroll={() =>
                    handleLoopScroll(hourRef, hours, setSelectedHour)
                  }
                  className="h-[252px] w-[56px] snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
                >
                  {Array.from({ length: paddingCount }).map((_, index) => (
                    <div key={`hour-top-${index}`} className="h-[36px]" />
                  ))}

                  {loopHours.map((hour, index) => (
                    <button
                      key={`hour-${index}`}
                      type="button"
                      onClick={() => {
                        setSelectedHour(hour)
                        scrollToValue(hourRef, hours, hour)
                      }}
                      className={`h-[36px] w-full snap-center text-center text-[20px] leading-[36px] ${
                        selectedHour === hour
                          ? 'font-semibold text-[#000000]'
                          : 'font-normal text-[#B8BEC4]'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}

                  {Array.from({ length: paddingCount }).map((_, index) => (
                    <div key={`hour-bottom-${index}`} className="h-[36px]" />
                  ))}
                </div>

                <span className="pointer-events-none w-[24px] text-center text-[20px]  leading-[36px] text-[#000000]">
                  시
                </span>
              </div>
            </div>

            <div className="flex h-full items-center justify-center">
              <div className="flex w-[120px] items-center justify-center gap-[20px]">
                <div
                  ref={minuteRef}
                  onScroll={() =>
                    handleLoopScroll(minuteRef, minutes, setSelectedMinute)
                  }
                  className="h-[252px] w-[56px] snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
                >
                  {Array.from({ length: paddingCount }).map((_, index) => (
                    <div key={`minute-top-${index}`} className="h-[36px]" />
                  ))}

                  {loopMinutes.map((minute, index) => (
                    <button
                      key={`minute-${index}`}
                      type="button"
                      onClick={() => {
                        setSelectedMinute(minute)
                        scrollToValue(minuteRef, minutes, minute)
                      }}
                      className={`h-[36px] w-full snap-center text-center text-[20px] leading-[36px] ${
                        selectedMinute === minute
                          ? 'font-semibold text-[#000000]'
                          : 'font-normal text-[#B8BEC4]'
                      }`}
                    >
                      {formatMinute(minute)}
                    </button>
                  ))}

                  {Array.from({ length: paddingCount }).map((_, index) => (
                    <div key={`minute-bottom-${index}`} className="h-[36px]" />
                  ))}
                </div>

                <span className="pointer-events-none w-[24px] text-center text-[20px] font-normal leading-[36px] text-[#000000]">
                  분
                </span>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute left-0 top-0 h-[80px] w-full bg-gradient-to-b from-white to-white/0" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[80px] w-full bg-gradient-to-t from-white to-white/0" />
        </div>

        <div className="mt-[28px]">
          <AuthButton isActive={true} onClick={handleConfirm}>
            완료
          </AuthButton>
        </div>
      </div>
    </div>
  )
}

export default TimeModal
