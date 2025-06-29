export interface GroupHistory {
  pk: number;
  historyDate: Date;
  user: string;
  historyChangeReason: string;
  historyType: '+' | '~' | '-';
}
