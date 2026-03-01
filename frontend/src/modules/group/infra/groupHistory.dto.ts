import { UserPreviewDTO } from '#modules/account/infra/user.dto';

export interface GroupHistoryDTO {
  pk: number;
  history_date: string;
  history_user?: UserPreviewDTO;
  history_change_reason: string;
  history_type: '+' | '~' | '-';
  next_history_date: string;
}

export interface GroupHistoryFormDTO {
  history_change_reason: string | null;
}
