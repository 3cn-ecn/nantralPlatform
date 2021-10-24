var dayjs = require("dayjs");
var isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);
var isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);
require("dayjs/locale/fr");
dayjs.locale("fr");

export function getDate(date: Date): string {
  return dayjs(date).format("dddd D MMMM");
}

export function getHour(date: Date): string {
  return dayjs(date).format("HH:mm");
}


export function getGroupDate(date: Date): string {
  var myDate = dayjs(date);
  if (myDate.isToday()) {
    return "Aujourd'hui";
  }
  if (myDate.isTomorrow()) {
    return "Demain";
  }
  var todayplus7 = dayjs().add('7', 'day');
  if (myDate.isBefore(todayplus7)) {
    return "Dans les 7 prochains jours";
  }
  return "Plus tard..."
}
