var dayjs = require("dayjs");
var isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
var isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);
require("dayjs/locale/fr");
dayjs.locale("fr");

export function getDate(date: Date): string {
  if (dayjs(date).isToday()) {
    return "Aujourd'hui";
  }

  if (dayjs(date).isTomorrow()) {
    return "Demain";
  }
  return dayjs(date).format("dddd D MMMM");
}
