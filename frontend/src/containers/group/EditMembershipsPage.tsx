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
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
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
import DeleteMemberModal from './components/DeleteMemberModal';
import { Group, Membership} from './interfaces';
import axios from '../utils/axios';

// passed through django template
declare const groupSlug: string;

/**
 * A little function to help us reorder items
 *
 * @param list - the list of items
 * @param startIndex
 * @param endIndex 
 * @returns the re-ordered list
 */
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * A function that returns a draggable component
 *
 * @param id - the id of the element
 * @param index - the index for ordering the elements
 * @returns A component
 */
function DraggableComponent(id: string, index: number) {
  return function (props: any): JSX.Element {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <TableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              ...(snapshot.isDragging && {
                background: "rgb(235,235,235)",
              })
            }}
            {...props}
          >
            {props.children}
          </TableRow>
        )}
      </Draggable>
    );
  };
};

/**
 * A function that returns a droppable component
 *
 * @param onDragEnd - function to use after dragging
 * @returns A component
 */
function DroppableComponent(onDragEnd: OnDragEndResponder) {
  return function (props: any): JSX.Element {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={"1"} direction="vertical">
          {(provided) => (
            <TableBody
              ref={provided.innerRef}
              {...provided.droppableProps}
              {...props}
            >
              {props.children}
              {provided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </DragDropContext>
    );
  };
};

/**
 * A row of the table with a membership
 * 
 * @param props 
 * @returns 
 */
function MembershipRow(props: {
  item: Membership;
  index: number;
  group: Group;
  updateMembership: (member: Membership) => Promise<void>;
  deleteMembership: (member: Membership) => Promise<void>;
}) {
  const { item, index, group, updateMembership, deleteMembership } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return <TableRow
    component={DraggableComponent(item.dragId!!, index)}
  >
    <TableCell scope="row" sx={{width: 0}}>
      <DragIndicatorIcon color='disabled' />
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar url={item.student.picture} title={item.student.full_name} size='small' />
        <Typography noWrap fontWeight="lg">
          {item.student.full_name}
        </Typography>
      </Box>
    </TableCell>
    <TableCell>
      {item.summary}
    </TableCell>
    <TableCell>{
      item.admin ?
        <CheckCircleIcon color='success' />
      : item.admin_request ?
        <HelpIcon color='warning' />
      : <></>
    }</TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton title='Ouvrir' aria-label='show' size='small' onClick={() => setOpenShowModal(true)}>
          <VisibilityIcon fontSize='small'/>
        </IconButton>
        <IconButton title='Modifier' aria-label='edit' size='small' onClick={() => setOpenEditModal(true)}>
          <EditIcon fontSize='small'/>
        </IconButton>
        <IconButton title='Supprimer' aria-label='edit' size='small' onClick={() => setOpenDeleteModal(true)}>
          <DeleteIcon fontSize='small'/>
        </IconButton>
      </Box>
      <ShowMemberModal
        open={openShowModal}
        closeModal={() => setOpenShowModal(false)}
        openEditModal={() => { setOpenShowModal(false); setOpenEditModal(true); }}
        member={item}
        group={group}
      />
      <EditMemberModal
        open={openEditModal}
        saveMembership={updateMembership}
        closeModal={() => setOpenEditModal(false)}
        openDeleteModal={() => { setOpenEditModal(false); setOpenDeleteModal(true); }}
        member={item}
        group={group}
      />
      <DeleteMemberModal
        open={openDeleteModal}
        deleteMembership={deleteMembership}
        closeModal={() => setOpenDeleteModal(false)}
        member={item}
      />
    </TableCell>
  </TableRow>
}

/**
 * Main table component for editing members in the admin page of groups.
 */
function EditMembershipsPage(props: {}): JSX.Element {
  // data
  const [ group, setGroup ] = useState<Group | null>(null);
  const [ members, setMembers ] = useState<Membership[]>([]);
  const [ loadState, setLoadState ] = useState<'load' | 'success' | 'fail'>('load');
  // status of modals
  const [ message, setMessage ] = useState<{type: any; text: string }>({ type: null, text: '' });
  const [ openAddModal, setOpenAddModal ] = useState(false);

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
   * Callback after dropping for the drag-and-drop.
   * Send a request to the server to save the new order.
   */
  async function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination || result.destination.index === result.source.index)
      return;
    const source = result.source.index;
    const dest = result.destination.index;
    const r_members = reorder(members, source, dest);
    setMembers(r_members);
    axios.post('/api/group/membership/reorder/', {
      member: members[source].id,
      lower: dest + 1 < members.length ? r_members[dest + 1].id : null
    }, {params: filters})
    .then(() => setMessage({ type: 'success', text: 'Réagencement sauvegardé !'}))
    .catch(() => setMessage({ type: 'error', text: 'Erreur de réseau : le réagencement n\'est pas sauvegardé...'}));
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
      .then(() => getMembers())
    )
  }

  /** A function to create a new membership object. */
  async function createMembership(member: Membership) {
    return (
      axios
      .post('/api/group/membership/', member)
      .then(() => getMembers())
    );
  };

  return loadState == 'load' ?
    <p>Chargement en cours... ⏳</p>
  : loadState == 'fail' ?
    <p>Échec du chargement 😢</p>
  : <>
      <TableContainer component={Paper}>
        <Snackbar
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          onClose={() => setMessage({ type: 'success', text: '' })}
          open={!!message.text}>
          <Alert severity={message.type} sx={{ width: '100%' }} elevation={6} variant="filled">
            {message.text}
          </Alert>
        </Snackbar>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Résumé</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component={DroppableComponent(onDragEnd)}>
            {members.map((item, index) => (
              <MembershipRow
                item={item}
                index={index}
                group={group!!}
                key={item.id}
                updateMembership={updateMembership}
                deleteMembership={deleteMembership}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        sx={{ mt: 2, ml: 'auto'}}
        onClick={() => setOpenAddModal(true)}
      >
        Ajouter
      </Button>
      <EditMemberModal
        open={openAddModal}
        saveMembership={createMembership}
        closeModal={() => setOpenAddModal(false)}
        group={group}
      />
    </>
}

render(<EditMembershipsPage />, document.getElementById("root-members"));