import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Snackbar, Alert, Button, Box, IconButton } from '@mui/material';
import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Membership, Student, Page } from './interfaces';
import axios from '../utils/axios';
import ListMembershipsGrid from './components/ListMembershipsGrid';

// passed through django template

interface QueryParams {
  student: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

/**
 * Main table component for editing members in the admin page of groups.
 */
export function MembershipsStudent(props: { Id: int }): JSX.Element {
  // data
  const { Id } = props;
  const [student, setStudent] = useState<Student | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loadState, setLoadState] = useState<'load' | 'success' | 'fail'>(
    'load'
  );

  const studentId = Id.toString();
  // status of modals
  const [message, setMessage] = useState<{ type: any; text: string }>({
    type: null,
    text: '',
  });
  // urls and filters passed as query parameters
  const [prevUrl, setPrevUrl] = useState('');
  const [nextUrl, setNextUrl] = useState('');
  const [filters, setFilters] = useState<QueryParams>({
    student: studentId,
    from: new Date().toISOString(),
  });

  useEffect(() => {
    // wait for all request
    Promise.all([
      // fetch memberships objects
      getMemberships(),
      // fetch student objet
      axios
        .get<Student>('/api/student/student/me')
        .then((res) => setStudent(res.data)),
    ])
      .then(() => setLoadState('success'))
      .catch(() => setLoadState('fail'));
  }, []);

  /** Get the list of members */
  async function getMemberships(
    url = '/api/group/membership/',
    query_params: Partial<QueryParams> = filters
  ): Promise<void> {
    return axios
      .get<Page<Membership>>(url, { params: query_params })
      .then((res) => res.data)
      .then((data) => {
        setMembers(
          data.results.map((item) => {
            item.dragId = `item-${item.id}`; // add a dragId for the drag-and-drop
            return item;
          })
        );
        setPrevUrl(data.previous);
        setNextUrl(data.next);
      });
  }

  if (loadState === 'load' || !student) return <p>Chargement en cours... ⏳</p>;

  if (loadState === 'fail') return <p>Échec du chargement 😢</p>;

  return (
    <>
      <h2>Groupes</h2>
      <ListMembershipsGrid members={members} student={student} />
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        {filters.from ? (
          <Button
            variant="text"
            onClick={() => {
              setFilters({ ...filters, from: undefined });
              getMemberships();
            }}
          >
            Afficher les anciens groupes
          </Button>
        ) : (
          <Button
            variant="text"
            onClick={() => {
              setFilters({ ...filters, from: new Date().toISOString() });
              getMemberships();
            }}
          >
            Masquer les anciens groupes
          </Button>
        )}
        <IconButton
          sx={{ ml: 'auto' }}
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
      </Box>
      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setMessage({ type: 'success', text: '' })}
        open={!!message.text}
      >
        <Alert
          severity={message.type}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
}

render(<MembershipsStudent />, document.getElementById('root-members'));
