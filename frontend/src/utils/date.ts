export function isThisWeek(date: Date): boolean {
  const today = new Date();
  const in7days = new Date();
  in7days.setDate(today.getDate() + 7);
  return (
    today.getTime() <= date.getTime() && date.getTime() <= in7days.getTime()
  );
  // const todayTime: number = date.getTime();
  // const monday = new Date();
  // monday.setDate(monday.getDate() - monday.getDay() + 1);
  // const sunday = new Date();
  // sunday.setDate(sunday.getDate() - sunday.getDay() + 8);
  // return todayTime >= monday.getTime() && todayTime <= sunday.getTime();
}
