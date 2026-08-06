import { Check, NotificationsNone } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateSubscriptionApi } from '#modules/group/api/updateSubscription.api';
import { Group } from '#modules/group/types/group.types';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

interface SubscribeButtonProps {
  isSubscribed: boolean;
  groupSlug: string;
}

export function SubscribeButton({
  isSubscribed,
  groupSlug,
}: SubscribeButtonProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (subscribe: boolean) => {
      const queryKey = ['group', { slug: groupSlug }];
      const data = queryClient.getQueryData<Group>(queryKey);
      if (data) {
        // optimistic update
        queryClient.setQueryData<Group>(queryKey, {
          ...data,
          isSubscribed: subscribe,
        });
      }
      await updateSubscriptionApi(groupSlug, subscribe);
    },
    onError: (_, subscribe) => {
      const queryKey = ['group', { slug: groupSlug }];
      const data = queryClient.getQueryData<Group>(queryKey);
      if (data) {
        // go back to previous value
        queryClient.setQueryData<Group>(queryKey, {
          ...data,
          isSubscribed: !subscribe,
        });
      }
    },
  });

  return (
    <LoadingButton
      startIcon={isSubscribed ? <Check /> : <NotificationsNone />}
      variant={isSubscribed ? 'outlined' : 'contained'}
      onClick={() => mutate(!isSubscribed)}
      loading={isPending}
    >
      {isSubscribed
        ? t('group.details.subscribed')
        : t('group.details.subscribe')}
    </LoadingButton>
  );
}
