import { useState } from 'react';

import { Paper } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReorderMemberApi } from '#modules/group/api/reorderMember.api';
import { Membership } from '#modules/group/types/membership.types';
import { useToast } from '#shared/context/Toast.context';

import { DraggableList } from './components/DraggableList';

interface EditMembersViewProps {
  members: Membership[];
}

export function EditMembersView({ members }: EditMembersViewProps) {
  const [memberships, setMemberships] = useState(members);
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(ReorderMemberApi, {
    onSuccess: () => {
      showToast({
        variant: 'success',
        message: 'Réagencement sauvegardé !',
      });
      queryClient.invalidateQueries([
        'members',
        { slug: members[0].group.slug },
      ]);
    },
    onError: () =>
      showToast({
        variant: 'error',
        message: "Erreur de réseau : le réagencement n'est pas sauvegardé...",
      }),
  });

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
      <Paper>
        <DraggableList
          items={memberships}
          reorderMemberships={reorderMemberships}
        />
      </Paper>
    </>
  );
}
