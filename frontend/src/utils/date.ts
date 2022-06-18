import i18n from 'i18next';

interface DateFormat {
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

export function formatDate(date: Date, format: DateFormat) {
  const lang = i18n.language;
  const formatter = new Intl.DateTimeFormat(lang, format);
  return formatter.format(date);
}
