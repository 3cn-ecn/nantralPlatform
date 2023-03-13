export function isThisWeek(date: Date): boolean {
  const todayTime: number = date.getTime();
  const monday = new Date();
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  const sunday = new Date();
  sunday.setDate(sunday.getDate() - sunday.getDay() + 8);
  return todayTime >= monday.getTime() && todayTime <= sunday.getTime();
}
