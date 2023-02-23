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
  // filters passed as query parameters
  const [ filters, setFilters ] = useState<{student: string; from?: string; to?: string}>({
    student: studentId,
    from: new Date().toISOString()
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

  if (loadState === 'load' || !student)
    return <p>Chargement en cours... ⏳</p>;
  
  if (loadState === 'fail')
    return <p>Échec du chargement 😢</p>;

  return (
    <>
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
              filters.from = undefined;
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
  );
}

render(<MembershipsStudent />, document.getElementById("root-members"));
