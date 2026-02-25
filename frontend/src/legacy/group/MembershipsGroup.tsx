import { useCallback, useEffect, useState } from 'react';

import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Button, IconButton, Typography } from '@mui/material';

import { User } from '#modules/account/user.types';
import { useGroupDetailsQuery } from '#modules/group/hooks/useGroupDetails.query';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useToast } from '#shared/context/Toast.context';

import axios from '../utils/axios';
import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';
import ListMembershipsGrid from './components/ListMembershipsGrid';
import ListMembershipsTable from './components/ListMembershipsTable';
import ModalEditMember from './components/ModalEditMember';
import { Membership, Page } from './interfaces';

// passed through django template
declare const groupSlug: string;
declare const displayType: 'grid' | 'table';

interface QueryParams {
  group: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Main table component for editing members in the admin page of groups.
 */
function MembershipsGroup(): JSX.Element {
  // hooks
  const showToast = useToast();
  const { group } = useGroupDetailsQuery(groupSlug);
  // data
  const [student, setStudent] = useState<User | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loadState, setLoadState] = useState<'load' | 'success' | 'fail'>(
    'load',
  );
  const [openAddModal, setOpenAddModal] = useState(false);
  // urls and filters passed as query parameters
  const [prevUrl, setPrevUrl] = useState('');
  const [nextUrl, setNextUrl] = useState('');
  const [filters] = useState<QueryParams>({
    group: groupSlug,
    from: new Date().toISOString(),
  });

  /**
   * Get the list of members
   * TODO: replace with a useQuery hook
   */
  const getMemberships = useCallback(
    async function getMemberships(
      url = '/api/group/membership/',
      queryParams: Partial<QueryParams> = filters,
    ): Promise<void> {
      return axios
        .get<Page<Membership>>(url, { params: queryParams })
        .then((res) => res.data)
        .then((data) => {
          setMembers(
            data.results.map((item) => {
              item.dragId = `item-${item.id}`; // add a dragId for the drag-and-drop
              return item;
            }),
          );
          setPrevUrl(data.previous);
          setNextUrl(data.next);
        });
    },
    [filters],
  );

  useEffect(() => {
    // wait for all request
    Promise.all([
      // fetch memberships objects
      getMemberships(),
      // fetch user objet
      axios
        .get<User>('/api/account/user/me/')
        .then((res) => setStudent(res.data)),
    ])
      .then(() => setLoadState('success'))
      .catch(console.log);
  }, [getMemberships]);

  /**
   * Reorder memberships
   * TODO: replace with a useMutation hook
   *
   * @param reorderedMembers - the new ordered list
   * @param member - the member who has moved
   * @param lower - the member who is now just before the member who moved
   */
  async function reorderMemberships(
    reorderedMembers: Membership[],
    member: Membership,
    lower?: Membership,
  ) {
    setMembers(reorderedMembers);
    axios
      .post(
        '/api/group/membership/reorder/',
        {
          member: member.id,
          lower: lower?.id,
        },
        { params: filters },
      )
      .then(() =>
        showToast({
          variant: 'success',
          message: 'Réagencement sauvegardé !',
        }),
      )
      .catch(() =>
        showToast({
          variant: 'error',
          message: "Erreur de réseau : le réagencement n'est pas sauvegardé...",
        }),
      );
  }

  /**
   * A function to update a membership object.
   * TODO: replace with a useMutation hook
   */
  async function updateMembership(member: Membership, reload = false) {
    return axios
      .put(`/api/group/membership/${member.id}/`, member)
      .then((res) => {
        const i = members.findIndex((elt) => elt.id === member.id);
        Object.assign(members[i], res.data);
        if (reload) {
          getMemberships();
        }
      });
  }

  /**
   * A function to delete a membership object.
   * TODO: replace with a useMutation hook
   */
  async function deleteMembership(member: Membership) {
    return axios
      .delete(`/api/group/membership/${member.id}/`)
      .then(() => getMemberships());
  }

  /**
   * A function to create a new membership object.
   * TODO: replace with a useMutation hook
   */
  async function createMembership(member: Membership) {
    return axios
      .post('/api/group/membership/', member)
      .then(() => getMemberships());
  }

  if (loadState === 'load' || !group || !student)
    return <p>Chargement en cours... ⏳</p>;

  if (loadState === 'fail') return <p>Échec du chargement 😢</p>;

  return (
    <>
      <FlexRow gap={2} mb={1} alignItems="center">
        <Typography variant="h2">Membres</Typography>
        {group.isAdmin && displayType === 'grid' && (
          <Button
            variant="outlined"
            color="secondary"
            href="edit/members"
            endIcon={<OpenInNewIcon />}
            size="small"
          >
            Modifier
          </Button>
        )}
      </FlexRow>
      {displayType === 'grid' ? (
        <ListMembershipsGrid
          members={members}
          group={group}
          student={student}
          updateMembership={updateMembership}
          deleteMembership={(member: Membership) => deleteMembership(member)}
        />
      ) : (
        <ListMembershipsTable
          members={members}
          group={group}
          student={student}
          reorderMemberships={reorderMemberships}
          updateMembership={updateMembership}
          deleteMembership={(member: Membership) => deleteMembership(member)}
        />
      )}
      <FlexRow flexWrap="wrap" mt={1} gap={1}>
        {((!group.isMember && !group.lockMemberships) || group.isAdmin) && (
          <>
            <Button variant="contained" onClick={() => setOpenAddModal(true)}>
              Ajouter
            </Button>
            <ModalEditMember
              open={openAddModal}
              saveMembership={(member: Membership) => createMembership(member)}
              closeModal={() => setOpenAddModal(false)}
              group={group}
              student={student}
            />
          </>
        )}
        {filters.from ? (
          <Button
            variant="text"
            size="small"
            color="secondary"
            onClick={() => {
              filters.from = undefined;
              getMemberships();
            }}
          >
            Afficher les anciens membres
          </Button>
        ) : (
          <Button
            variant="text"
            size="small"
            color="secondary"
            onClick={() => {
              filters.from = new Date().toISOString();
              getMemberships();
            }}
          >
            Masquer les anciens membres
          </Button>
        )}
        <Spacer flex={1} />
        <IconButton
          disabled={!prevUrl}
          onClick={() => getMemberships(prevUrl, {})}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          disabled={!nextUrl}
          onClick={() => getMemberships(nextUrl, {})}
        >
          <NavigateNextIcon />
        </IconButton>
      </FlexRow>
    </>
  );
}

wrapAndRenderLegacyCode(<MembershipsGroup />, 'root-members');
