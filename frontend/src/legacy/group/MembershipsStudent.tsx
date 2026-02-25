import { useCallback, useEffect, useState } from 'react';

import {
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Alert, Box, Button, IconButton, Snackbar } from '@mui/material';

import { User } from '#modules/account/user.types';

import axios from '../utils/axios';
import { wrapAndRenderLegacyCode } from '../utils/wrapAndRenderLegacyCode';
import ListMembershipsGrid from './components/ListMembershipsGrid';
import { Membership, Page } from './interfaces';

// passed through django template
declare const studentId: string;

interface QueryParams {
  user: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Main table component for editing members in the admin page of groups.
 */
function MembershipsStudent(): JSX.Element {
  // data
  const [student, setStudent] = useState<User | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loadState, setLoadState] = useState<'load' | 'success' | 'fail'>(
    'load',
  );
  // status of modals
  const [message, setMessage] = useState<{ type: any; text: string }>({
    type: null,
    text: '',
  });
  // urls and filters passed as query parameters
  const [prevUrl, setPrevUrl] = useState('');
  const [nextUrl, setNextUrl] = useState('');
  const [filters, setFilters] = useState<QueryParams>({
    user: studentId,
    from: new Date().toISOString(),
  });

  /** Get the list of members */
  const getMemberships = useCallback(
    async function getMemberships(
      url = '/api/group/membership/',
      query_params: Partial<QueryParams> = filters,
    ): Promise<void> {
      return axios
        .get<Page<Membership>>(url, { params: query_params })
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
        .get<User>('/api/account/user/me')
        .then((res) => setStudent(res.data)),
    ])
      .then(() => setLoadState('success'))
      .catch(() => setLoadState('fail'));
  }, [getMemberships]);

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
              filters.from = undefined;
              getMemberships();
            }}
          >
            Afficher les anciens groupes
          </Button>
        ) : (
          <Button
            variant="text"
            onClick={() => {
              filters.from = new Date().toISOString();
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

wrapAndRenderLegacyCode(<MembershipsStudent />, 'root-members');
