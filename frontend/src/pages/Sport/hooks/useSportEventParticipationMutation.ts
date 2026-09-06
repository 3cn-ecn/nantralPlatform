import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerAsSportNonParticipantApi } from '#modules/event/api/registerAsSportNonParticipant.api';
import { registerAsSportParticipantApi } from '#modules/event/api/registerAsSportParticipant.api';
import { unregisterAsSportNonParticipantApi } from '#modules/event/api/unregisterAsSportNonParticipant.api';
import { unregisterAsSportParticipantApi } from '#modules/event/api/unregisterAsSportParticipant.api';

export type SportEventParticipationChoice = 'participant' | 'nonParticipant';

export function useSportEventParticipationMutation(
  sportEventId: number,
  isParticipating: boolean | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (choice: SportEventParticipationChoice) => {
      if (choice === 'participant') {
        return isParticipating === true
          ? unregisterAsSportParticipantApi(sportEventId)
          : registerAsSportParticipantApi(sportEventId);
      }

      return isParticipating === false
        ? unregisterAsSportNonParticipantApi(sportEventId)
        : registerAsSportNonParticipantApi(sportEventId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getSportEvents'] });
      await queryClient.invalidateQueries({
        queryKey: ['sport-event', { id: sportEventId }],
      });
      await queryClient.invalidateQueries({
        queryKey: ['sport-event-people', sportEventId],
      });
    },
  });
}
