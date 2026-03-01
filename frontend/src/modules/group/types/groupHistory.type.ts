import { UserPreview } from '#modules/account/user.types';

export interface GroupHistory {
  pk: number;
  historyDate: Date;
  historyUser?: UserPreview;
  historyChangeReason: string;
  historyType: '+' | '~' | '-';
  nextHistoryDate: Date;
}

export type GroupHistoryForm = Pick<GroupHistory, 'historyChangeReason'>;
