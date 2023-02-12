import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
  Snackbar,
  Alert,
  Button,
  Box
} from '@mui/material';
import { Membership, Student } from './interfaces';
import axios from '../utils/axios';
import ListMembershipsGrid from './components/ListMembershipsGrid';

// passed through django template
declare const studentId: string;

/**
 * Main table component for editing members in the admin page of groups.
 */
function MembershipsStudent(props: {}): JSX.Element {
  // data
  const [ student, setStudent ] = useState<Student | null>(null);
  const [ members, setMembers ] = useState<Membership[]>([]);
  const [ loadState, setLoadState ] = useState<'load' | 'success' | 'fail'>('load');
  // status of modals
  const [ message, setMessage ] = useState<{type: any; text: string }>({ type: null, text: '' });
  const [ openAddModal, setOpenAddModal ] = useState(false);
  // filters passed as query parameters
  const [ filters, setFilters ] = useState({
    student: studentId,
    from: new Date().toISOString() as null | string,
    to: null as null | string
  });

  useEffect(() => {
    // wait for all request
    Promise.all([
      // fetch memberships objects
      getMemberships(),
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
    );
  }

  /** A function to create a new membership object. */
  async function createMembership(member: Membership) {
    return (
      axios
      .post('/api/group/membership/', member)
      .then(() => getMemberships())
    );
  };

  return loadState == 'load' || !student ?
    <p>Chargement en cours... ⏳</p>
  : loadState == 'fail' ?
    <p>Échec du chargement 😢</p>
  : <>
      <h2>Groupes</h2>
      <ListMembershipsGrid
        members={members}
        student={student}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        { filters.from
        ? <Button
            variant='text'
            onClick={() => {
              filters.from = null;
              getMemberships();
            }}
          >
            Afficher les anciens groupes
          </Button>
        : <Button
            variant='text'
            onClick={() => {
              filters.from = new Date().toISOString();
              getMemberships();
            }}
          >
            Masquer les anciens groupes
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

render(<MembershipsStudent />, document.getElementById("root-members"));
