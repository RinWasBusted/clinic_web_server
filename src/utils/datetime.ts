import { DateTime } from "luxon";

const location = "Asia/Bangkok"; // Example: Convert to Bangkok time (UTC + 7)

export function getLocalStartAndEndOfDayInUTC(dateString?: string) {
  const dateTime = dateString ? DateTime.fromISO(dateString, { zone: location }) : DateTime.now().setZone(location);

  const start = dateTime.startOf("day").toUTC().toJSDate();
  const end = dateTime.endOf("day").toUTC().toJSDate();
  return { start, end };
}
export function toLocalJSDate(date: Date) {
  return DateTime.fromJSDate(date).setZone(location).toJSDate();
}
export function toLocalForAPI(date: Date) {
  return DateTime.fromJSDate(date).setZone(location).toISO();
}
export function toLocalString(date: Date) {
  return DateTime.fromJSDate(date).setZone(location).toFormat("yyyy-MM-dd HH:mm:ss");
}
export function toLocalDateString(date: Date) {
  return DateTime.fromJSDate(date).setZone(location).toFormat("yyyy-MM-dd");
}
export function toLocalTimeString(date: Date) {
  return DateTime.fromJSDate(date).setZone(location).toFormat("HH:mm:ss");
}
