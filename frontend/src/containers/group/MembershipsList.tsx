import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
  DropResult
} from 'react-beautiful-dnd';
import Avatar from './components/Avatar';
import ShowMemberModal from './components/ShowMemberModal';
import EditMemberModal from './components/EditMemberModal';
import { Group, Membership} from './interfaces';
import axios from '../utils/axios';

// passed through django template
declare const groupSlug: string;

/**
 * A row of the table with a membership
 * 
 * @param props 
 * @returns 
 */
function MembershipCard(props: {
  item: Membership;
  group: Group,
  updateMembership: (member: Membership) => Promise<void>
}) {
  const { item, group, updateMembership } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardActionArea onClick={() => setOpenShowModal(true)}>
          <CardContent sx={{ display: 'flex', alignBoxs: 'center', gap: 1.5, p: 1.5 }}>
            <Avatar url={item.student.picture_url} title={item.student.full_name} size='large' />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant='h6' sx={{ fontWeight: 500 }} noWrap>
                {item.student.full_name}
              </Typography>
              <Typography sx={{fontSize: '0.9em' }} color='text.secondary' noWrap>
                {item.summary}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <ShowMemberModal
        open={openShowModal}
        onClose={() => setOpenShowModal(false)}
        onEdit={() => { setOpenShowModal(false); setOpenEditModal(true); }}
        member={item}
        group={group}
      />
      <EditMemberModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onValid={(data?: Membership) =>
          data
          ? updateMembership(data).then(() => setOpenEditModal(false)).catch(() => {})
          : setOpenEditModal(false)
        }
        member={item}
        group={group}
      />
    </Grid>
  );
};

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
      axios.get<Membership[]>('/api/group/membership/', {params: filters})
      .then((res) => res.data.map((item) => {
        item.dragId = `item-${item.id}`;  // add a dragId for the drag-and-drop
        return item;
      }))
      .then((list) => setMembers(list)),
      // fetch group object
      axios.get<Group>(`/api/group/group/${groupSlug}`)
      .then((res) => setGroup(res.data))
    ])
    .then(() => setLoadState('success'))
    .catch(() => setLoadState('fail'));
  }, []);

  /**
   * A function to edit a membership object
   *
   * @param member 
   */
  async function updateMembership(member: Membership) {
    return (
      axios.put(`/api/group/membership/${member.id}/`, member)
      .then((res) => {
        const i = members.findIndex((elt) => elt.id === member.id);
        Object.assign(members[i], res.data);
      })
      .catch(() => setMessage({ open: true, type: 'error', text: 'Erreur de réseau' })));
  };

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
        />
      ))}
    </Grid>
}

render(<MembershipsList />, document.getElementById("root-members"));
