var dayjs = require("dayjs");
require("dayjs/locale/fr");
dayjs.locale("fr");

export function makeNiceDate(date: string): string {
  if (date === null) {
    return null;
  }
  return dayjs(date, "YYYY-MM-DD").format("D MMMM YYYY");
}
