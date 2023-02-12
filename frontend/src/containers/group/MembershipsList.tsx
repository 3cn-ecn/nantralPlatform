import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
  Snackbar,
  Alert,
  Grid,
} from '@mui/material';
import MembershipCard from './components/MembershipCard';
import { Group, Membership} from './interfaces';
import axios from '../utils/axios';

// passed through django template
declare const groupSlug: string;

/**
 * Main table component for editing members in the admin page of groups.
 */
function MembershipsList(props: {}): JSX.Element {
  // data
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loadState, setLoadState] = useState<'load' | 'success' | 'fail'>('load');
  // status of modals
  const [message, setMessage] = useState<{open: boolean; type: any; text: string }>({ open: false, type: null, text: '' });

  // filters passed as query parameters
  const filters = {
    group: groupSlug,
    from: new Date().toISOString(),
    to: null
  };

  useEffect(() => {
    Promise.all([
      // fetch memberships objects
      getMembers(),
      // fetch group object
      axios.get<Group>(`/api/group/group/${groupSlug}`)
      .then((res) => setGroup(res.data))
    ])
    .then(() => setLoadState('success'))
    .catch(() => setLoadState('fail'));
  }, []);

  /** Get the list of members */
  async function getMembers(): Promise<void> {
    return axios.get<Membership[]>('/api/group/membership/', {params: filters})
    .then((res) => res.data.map((item) => {
      item.dragId = `item-${item.id}`;  // add a dragId for the drag-and-drop
      return item;
    }))
    .then((list) => setMembers(list));
  }

  /**
   * A function to edit a membership object
   *
   * @param member 
   */
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
      .then(() => getMembers())
    )
  }

  return loadState == 'load' ?
    <p>Chargement en cours... ⏳</p>
  : loadState == 'fail' ?
    <p>Échec du chargement 😢</p>
  : 
    <Grid container spacing={2}>
      <Snackbar 
        open={message.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setMessage({ ...message, open: false })}>
        <Alert severity={message.type} sx={{ width: '100%' }} elevation={6} variant="filled">
          {message.text}
        </Alert>
      </Snackbar>
      {members.map((item, index) => (
        <MembershipCard
          item={item}
          group={group!!}
          key={item.id}
          updateMembership={updateMembership}
          deleteMembership={deleteMembership}
        />
      ))}
    </Grid>
}

render(<MembershipsList />, document.getElementById("root-members"));
