export const SCHEDULE_CONFLICT_MESSAGE =
  '같은 시간에 예약된 다른 홍보가 있어요. 다른 시간을 선택해주세요.'

const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

const parseSchedule = (schedule) => {
  const start = new Date(schedule.publishTime)
  const day = weekdays.indexOf(schedule.dayOfWeek)
  if (Number.isNaN(start.getTime()) || day < 0) {
    throw new Error('예약 정보를 확인할 수 없어요. 잠시 후 다시 시도해주세요.')
  }
  return { start, day }
}

const getEnd = (deadline) => {
  if (!deadline) return Infinity
  const end = new Date(deadline).getTime()
  if (Number.isNaN(end)) {
    throw new Error('예약 마감일을 확인할 수 없어요. 잠시 후 다시 시도해주세요.')
  }
  return end
}

// Reservations recur weekly in the same local time used by the booking forms.
export const schedulesOverlap = (left, leftDeadline, right, rightDeadline, now = new Date()) => {
  const a = parseSchedule(left)
  const b = parseSchedule(right)
  if (a.day !== b.day || a.start.getHours() !== b.start.getHours() ||
      a.start.getMinutes() !== b.start.getMinutes()) return false

  const lowerBound = Math.max(a.start.getTime(), b.start.getTime(), now.getTime())
  const occurrence = new Date(lowerBound)
  occurrence.setHours(a.start.getHours(), a.start.getMinutes(), 0, 0)
  occurrence.setDate(occurrence.getDate() + (a.day - occurrence.getDay() + 7) % 7)
  if (occurrence.getTime() < lowerBound) occurrence.setDate(occurrence.getDate() + 7)
  return occurrence.getTime() <= Math.min(getEnd(leftDeadline), getEnd(rightDeadline))
}
