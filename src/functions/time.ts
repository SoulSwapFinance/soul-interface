import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import dayOfYear from 'dayjs/plugin/dayOfYear.js'

dayjs.extend(timezone)
dayjs.extend(dayOfYear)
dayjs.extend(utc)

function getEasternStandardTime() {
  const now = dayjs().tz('EST')
  return {
    now,
    minute: now.minute(),
    hour: now.hour(),
    day: now.day(),
  }
}

export function isWeekend(): boolean {
  const { day } = getEasternStandardTime()
  // monday through friday
  return day == 0 || day == 6
}

export function isPreMarket(): boolean {
  const { minute, hour } = getEasternStandardTime()
  if (isWeekend()) return false
  // between 4:00 and 9:29
  return hour >= 4 && (hour < 9 || (hour === 9 && minute < 30))
}

export function isRegularMarket(): boolean {
  const { minute, hour } = getEasternStandardTime()
  if (isWeekend()) return false
  // between 9:30 and 15:59
  return (hour >= 10 || (hour === 9 && minute >= 30)) && hour < 16
}

export function isAfterHours(): boolean {
  const { hour } = getEasternStandardTime()
  if (isWeekend()) return false
  // between 16:00 and 19:59
  return hour >= 16 && hour < 20
}
