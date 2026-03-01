import { GroupHistoryFormDTO } from '#modules/group/infra/groupHistory.dto';
import { GroupHistoryForm } from '#modules/group/types/groupHistory.type';

export function convertGroupHistoryForm(
  form: GroupHistoryForm,
): GroupHistoryFormDTO {
  return {
    history_change_reason: form.historyChangeReason || null,
  };
}
