export interface GroupHistoryDTO {
  pk: number;
  history_date: string;
  user: string;
  history_change_reason: string;
  history_type: '+' | '~' | '-';
}
