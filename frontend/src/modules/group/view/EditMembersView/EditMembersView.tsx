import { useState } from 'react';

import { Alert, CircularProgress, Paper, Typography } from '@mui/material';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { roundToNearestMinutes } from 'date-fns';

import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { reorderMembershipApi } from '#modules/group/api/reorderMember.api';
import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { AddMemberButton } from '#pages/GroupDetails/components/Buttons/AddMemberButton';
import { FlexAuto } from '#shared/components/FlexBox/FlexBox';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ModalEditMembership } from '../Modal/ModalEditMembership';
import { DraggableList } from './components/DraggableList';

interface EditMembersViewProps {
  group: Group;
}

export function EditMembersView({ group }: EditMembersViewProps) {
  const [selected, setSelected] = useState<Membership>();
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  async function reorderMembership({
    member,
    lower,
  }: {
    updatedMemberships: Membership[];
    member: Membership;
    lower?: Membership;
  }) {
    return await reorderMembershipApi({
      member: member.id,
      lower: lower?.id,
      group: member.group.slug,
    });
  }
  const today = roundToNearestMinutes(new Date());
  const queryKey = ['members', { slug: group.slug, from: today }];
  const { mutate } = useMutation({
    mutationFn: reorderMembership,
    onMutate: async ({ updatedMemberships }) => {
      // snapshot previous value
      const previousMemberships = queryClient.getQueryData(queryKey);
      // optimistically update to the new value
      queryClient.setQueryData(queryKey, {
        count: updatedMemberships.length,
        results: updatedMemberships,
      });
      // cancel any outgoing query
      await queryClient.cancelQueries({
        queryKey: queryKey,
      });

      return { previousMemberships };
    },
    onSuccess: () => {
      showToast({
        variant: 'success',
        message: t('group.details.modal.editMembership.success'),
      });
    },
    onError: (err, variables, context) => {
      // revert to previous data
      queryClient.setQueryData(queryKey, context?.previousMemberships);
      showToast({
        variant: 'error',
        message: t('group.details.modal.editMembership.error'),
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
  });

  const {
    data: memberships,
    isSuccess,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getMembershipListApi({
        group: group.slug,
        pageSize: 200,
        from: today,
      }),
    placeholderData: keepPreviousData,
  });

  if (!memberships) {
    return;
  }

  return (
    <>
      <FlexAuto justifyContent={'space-between'} alignItems={'center'} mb={1}>
        <Typography variant="h3" mb={1}>
          {t('group.details.modal.editGroup.members')} ({memberships.count})
        </Typography>
        <AddMemberButton group={group} />
      </FlexAuto>
      {isPending && <CircularProgress />}
      {isError && (
        <Alert severity="error">
          {t('group.details.modal.editGroup.error')}
        </Alert>
      )}
      {isSuccess && memberships?.count > 0 && (
        <Paper>
          <DraggableList
            items={memberships.results}
            reorderMemberships={(updatedMemberships, member, lower) => {
              mutate({ updatedMemberships, member, lower });
            }}
            onClick={setSelected}
          />
        </Paper>
      )}
      {isSuccess && memberships?.count === 0 && (
        <Typography>{t('group.details.modal.editGroup.noMembers')}</Typography>
      )}
      {selected && (
        <ModalEditMembership
          membership={selected}
          group={group}
          onClose={() => {
            setSelected(undefined);
          }}
        />
      )}
    </>
  );
}
