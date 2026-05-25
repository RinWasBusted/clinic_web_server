import { DateTime } from "luxon";
const location = "Asia/Bangkok"; // Example: Convert to Bangkok time (UTC + 7)
export function getLocalStartAndEndOfDayInUTC(dateString) {
    const dateTime = dateString ? DateTime.fromISO(dateString, { zone: location }) : DateTime.now().setZone(location);
    const start = dateTime.startOf("day").toUTC().toJSDate();
    const end = dateTime.endOf("day").toUTC().toJSDate();
    return { start, end };
}
export function getLocalDateTimeInUTC(date) {
    return DateTime.fromJSDate(date).setZone(location).toUTC().toJSDate();
}
// For JS Date object
export function toLocalJSDate(date) {
    return DateTime.fromJSDate(date).setZone(location).toJSDate();
}
export function toLocalForAPI(date) {
    return DateTime.fromJSDate(date).setZone(location).toISO();
}
// Display as string
export function toLocalString(date) {
    return DateTime.fromJSDate(date).setZone(location).toFormat("yyyy-MM-dd HH:mm:ss");
}
export function toLocalDateString(date) {
    return DateTime.fromJSDate(date).setZone(location).toFormat("yyyy-MM-dd");
}
export function toLocalTimeString(date) {
    return DateTime.fromJSDate(date).setZone(location).toFormat("HH:mm:ss");
}
export function addDays(date, days) {
    return toLocalJSDate(DateTime.fromJSDate(date).plus({ days }).toJSDate());
    // return DateTime.fromJSDate(date).plus({ days }).toJSDate();
}
export function dateDiffInDays(startDate, endDate) {
    const start = DateTime.fromJSDate(startDate).setZone(location).startOf("day");
    const end = DateTime.fromJSDate(endDate).setZone(location).startOf("day");
    return Math.round(end.diff(start, "days").days);
}
//# sourceMappingURL=datetime.js.map