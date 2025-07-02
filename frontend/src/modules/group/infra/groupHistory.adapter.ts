import { GroupHistoryDTO } from '#modules/group/infra/groupHistory.dto';
import { GroupHistory } from '#modules/group/types/groupHistory.type';

export function adaptGroupHistory(historyDto: GroupHistoryDTO): GroupHistory {
  return {
    pk: historyDto.pk,
    historyDate: new Date(historyDto.history_date),
    user: historyDto.user,
    historyChangeReason: historyDto.history_change_reason,
    historyType: historyDto.history_type,
  };
}
