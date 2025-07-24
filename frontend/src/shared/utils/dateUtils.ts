export function getScholarYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month < 8) {
    return `${year - 1}-${year}`;
  }

  return `${year}-${year + 1}`;
}
