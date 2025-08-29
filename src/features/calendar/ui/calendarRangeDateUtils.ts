import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
  format,
} from "date-fns";

export const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function getWeeks(month: Date): Date[][] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days: Date[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function isInRange(day: Date, start: Date | null, end: Date | null) {
  if (start && end) {
    return isWithinInterval(day, { start, end });
  }
  return false;
}

export function isSelected(day: Date, start: Date | null, end: Date | null) {
  return (start && isSameDay(day, start)) || (end && isSameDay(day, end));
}

export function toApiFormat(date: Date | null) {
  return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'") : null;
}
