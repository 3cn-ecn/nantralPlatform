import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
  Snackbar,
  Alert,
  Button,
  Box
} from '@mui/material';
import ModalEditMember from './components/ModalEditMember';
import { Group, Membership, Student } from './interfaces';
import axios from '../utils/axios';
import ListMembershipsGrid from './components/ListMembershipsGrid';
import ListMembershipsTable from './components/ListMembershipsTable';

// passed through django template
declare const groupSlug: string;
declare const displayType: 'grid' | 'table';

/**
 * Main table component for editing members in the admin page of groups.
 */
function Memberships(props: {}): JSX.Element {
  // data
  const [ group, setGroup ] = useState<Group | null>(null);
  const [ student, setStudent ] = useState<Student | null>(null);
  const [ members, setMembers ] = useState<Membership[]>([]);
  const [ loadState, setLoadState ] = useState<'load' | 'success' | 'fail'>('load');
  // status of modals
  const [ message, setMessage ] = useState<{type: any; text: string }>({ type: null, text: '' });
  const [ openAddModal, setOpenAddModal ] = useState(false);
  // filters passed as query parameters
  const [ filters, setFilters ] = useState({
    group: groupSlug,
    from: new Date().toISOString(),
    to: null
  });

  useEffect(() => {
    // wait for all request
    Promise.all([
      // fetch memberships objects
      getMemberships(),
      // fetch group object
      axios.get<Group>(`/api/group/group/${groupSlug}`)
      .then((res) => setGroup(res.data)),
      // fetch student objet
      axios.get<Student>('/api/student/student/me')
      .then((res) => setStudent(res.data)),
    ])
    .then(() => setLoadState('success'))
    .catch(() => setLoadState('fail'));
  }, []);

  /** Get the list of members */
  async function getMemberships(): Promise<void> {
    return axios.get<Membership[]>('/api/group/membership/', {params: filters})
    .then((res) => res.data.map((item) => {
      item.dragId = `item-${item.id}`;  // add a dragId for the drag-and-drop
      return item;
    }))
    .then((list) => setMembers(list));
  }

  /**
   * Reorder memberships
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
    axios.post('/api/group/membership/reorder/', {
      member: member.id,
      lower: lower?.id
    }, {params: filters})
    .then(() => setMessage({
      type: 'success',
      text: 'Réagencement sauvegardé !'
    }))
    .catch(() => setMessage({
      type: 'error',
      text: 'Erreur de réseau : le réagencement n\'est pas sauvegardé...'
    }));
  };

  /** A function to update a membership object. */
  async function updateMembership(member: Membership) {
    return (
      axios
      .put(`/api/group/membership/${member.id}/`, member)
      .then((res) => {
        const i = members.findIndex((elt) => elt.id === member.id);
        Object.assign(members[i], res.data);
      })
    );
  };

  /** A function to delete a membership object. */
  async function deleteMembership(member: Membership) {
    return (
      axios
      .delete(`/api/group/membership/${member.id}/`)
      .then(() => getMemberships())
      .then(() =>
        member.student.id === student.id
        && setGroup({...group, is_member: false }
      ))
    );
  }

  /** A function to create a new membership object. */
  async function createMembership(member: Membership) {
    return (
      axios
      .post('/api/group/membership/', member)
      .then(() => getMemberships())
      .then(() =>
        member.student as any === student.id
        && setGroup({ ...group, is_member: true }
      ))
    );
  };

  return loadState == 'load' ?
    <p>Chargement en cours... ⏳</p>
  : loadState == 'fail' ?
    <p>Échec du chargement 😢</p>
  : <>
      <h2>Membres</h2>
      { displayType === 'grid'
      ? <ListMembershipsGrid
          members={members}
          group={group!!}
          student={student!!}
          updateMembership={updateMembership}
          deleteMembership={deleteMembership}
        />
      : <ListMembershipsTable
          members={members}
          group={group!!}
          student={student!!}
          reorderMemberships={reorderMemberships}
          updateMembership={updateMembership}
          deleteMembership={deleteMembership}
        />
      }
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        { !group.is_member || group.is_admin
        ? <>
            <Button
              variant="contained"
              onClick={() => setOpenAddModal(true)}
            >
              Ajouter
            </Button>
            <ModalEditMember
              open={openAddModal}
              saveMembership={createMembership}
              closeModal={() => setOpenAddModal(false)}
              group={group!!}
              student={student!!}
            />
          </>
        : <></> }
        { filters.from
        ? <Button
            variant='text'
            onClick={() => {
              filters.from = null;
              getMemberships();
            }}
          >
            Afficher les anciens membres
          </Button>
        : <Button
            variant='text'
            onClick={() => {
              filters.from = new Date().toISOString();
              getMemberships();
            }}
          >
            Masquer les anciens membres
          </Button>
        }
      </Box>
      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setMessage({ type: 'success', text: '' })}
        open={!!message.text}>
        <Alert severity={message.type} sx={{ width: '100%' }} elevation={6} variant="filled">
          {message.text}
        </Alert>
      </Snackbar>
    </>
}

render(<Memberships />, document.getElementById("root-members"));
