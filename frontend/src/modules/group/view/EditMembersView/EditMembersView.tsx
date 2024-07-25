import { useEffect, useState } from 'react';

import { Paper, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { ReorderMemberApi } from '#modules/group/api/reorderMember.api';
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
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [selected, setSelected] = useState<Membership>();
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate } = useMutation(ReorderMemberApi, {
    onSuccess: () => {
      showToast({
        variant: 'success',
        message: t('group.details.modal.editMembership.success'),
      });
      queryClient.invalidateQueries(['members', { slug: group.slug }]);
    },
    onError: () =>
      showToast({
        variant: 'error',
        message: t('group.details.modal.editMembership.error'),
      }),
  });
  const today = new Date();
  const { data, isSuccess } = useQuery({
    queryKey: ['members', { slug: group.slug }],
    queryFn: () =>
      getMembershipListApi({
        group: group.slug,
        pageSize: 200,
        from: today,
      }),
  });

  useEffect(() => {
    if (data) {
      setMemberships(data.results);
    }
  }, [data]);

  function reorderMemberships(
    updatedMemberships: Membership[],
    member: Membership,
    lower?: Membership,
  ) {
    setMemberships(updatedMemberships);
    mutate({ member: member.id, lower: lower?.id, group: member.group.slug });
  }

  return (
    <>
      <FlexAuto justifyContent={'space-between'} alignItems={'center'} mb={1}>
        <Typography variant="h3" mb={1}>
          {t('group.details.modal.editGroup.members')} ({memberships.length})
        </Typography>
        <AddMemberButton group={group} />
      </FlexAuto>
      {isSuccess && data?.count > 0 && (
        <Paper>
          <DraggableList
            items={memberships}
            reorderMemberships={reorderMemberships}
            onClick={setSelected}
          />
        </Paper>
      )}
      {isSuccess && data?.count === 0 && (
        <Typography>Aucun membre pour le moment</Typography>
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
