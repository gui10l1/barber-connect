import { addMinutes, format, startOfDay } from "date-fns";

export default function parseMinutesToHourString(minutes) {
  const dayStart = startOfDay(new Date());
  const dayStartPlusHours = addMinutes(dayStart, minutes);

  return format(dayStartPlusHours, 'HH:mm');
}