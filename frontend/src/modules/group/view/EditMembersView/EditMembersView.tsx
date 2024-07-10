import { useEffect, useState } from 'react';

import { Paper, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMembershipListApi } from '#modules/group/api/getMembershipList.api';
import { ReorderMemberApi } from '#modules/group/api/reorderMember.api';
import { Membership } from '#modules/group/types/membership.types';
import { useToast } from '#shared/context/Toast.context';

import { ModalEditMembership } from '../Modal/ModalEditMembership';
import { DraggableList } from './components/DraggableList';

interface EditMembersViewProps {
  members: Membership[];
}

export function EditMembersView({ members }: EditMembersViewProps) {
  const [memberships, setMemberships] = useState<Membership[]>(members);
  const [selected, setSelected] = useState<Membership>();
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
  const { data, isSuccess } = useQuery({
    queryKey: ['members', { slug: members[0].group.slug }],
    queryFn: () =>
      getMembershipListApi({
        group: members[0].group.slug,
        pageSize: 200,
        // from: new Date(),
        to: new Date(),
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
      <Typography variant="h3" mb={1}>
        Membres ({memberships.length})
      </Typography>
      {isSuccess && data && (
        <Paper>
          <DraggableList
            items={memberships}
            reorderMemberships={reorderMemberships}
            onClick={setSelected}
          />
        </Paper>
      )}
      {selected && (
        <ModalEditMembership
          membership={selected}
          onClose={() => {
            setSelected(undefined);
          }}
        />
      )}
    </>
  );
}
