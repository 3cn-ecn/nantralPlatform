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
  Typography
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
import Avatar from './components/avatar';
import ShowMemberModal from './components/showMemberModal';
import { Student, Group, Membership} from './interfaces';
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
function MembershipRow(props: {item: Membership; index: number}) {
  const { item, index } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  return <TableRow
    component={DraggableComponent(item.dragId!!, index)}
    key={item.id}
  >
    <TableCell scope="row" sx={{width: 0}}>
      <DragIndicatorIcon color='disabled' />
    </TableCell>
    <TableCell>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar url={item.student.picture_url} title={item.student.full_name} size='small' />
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
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <IconButton aria-label='edit' size='small' onClick={() => setOpenShowModal(true)}><VisibilityIcon fontSize='small'/></IconButton>
        <IconButton aria-label='edit' size='small'><EditIcon fontSize='small'/></IconButton>
      </Box>
      <ShowMemberModal open={openShowModal} onClose={() => setOpenShowModal(false)} member={item}/>
    </TableCell>
  </TableRow>
}

/**
 * Main table component for editing members in the admin page of groups.
 */
function EditMembershipsPage(props: {}): JSX.Element {
  // members
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
    getMembers();
  }, []);

  /**
   * Get the list of memberships, for these filters (including the group slug)
   */
  async function getMembers() {
    axios.get<Membership[]>('/api/group/membership/', {params: filters})
    .then((res) => res.data.map((item) => {
      item.dragId = `item-${item.id}`;  // add a dragId for the drag-and-drop
      item.begin_date = new Date(item.begin_date);  // convert string to dates
      item.end_date = new Date(item.end_date);
      return item;
    }))
    .then((list) => {
      setMembers(list);
      setLoadState('success');
    })
    .catch(() => setLoadState('fail'));
  }

  /**
   * Callback after dropping for the drag-and-drop.
   * Send a request to the server to save the new order.
   */
  async function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) return;
    const source = result.source.index;
    const dest = result.destination.index;
    const r_members = reorder(members, source, dest);
    setMembers(r_members);
    axios.post('/api/group/membership/reorder/', {
      member: members[source].id,
      lower: dest + 1 < members.length ? r_members[dest + 1].id : null
    }, {params: filters})
    .then(() => setMessage({ open: true, type: 'success', text: 'Reordering saved!'}))
    .catch(() => setMessage({ open: true, type: 'error', text: 'An error occurred: reordering not saved...'}));
  }

  return loadState == 'load' ?
    <p>Chargement en cours... ⏳</p>
  : loadState == 'fail' ?
    <p>Échec du chargement 😢</p>
  : 
    <TableContainer component={Paper}>
      <Snackbar 
        open={message.open}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => setMessage({ ...message, open: false })}>
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
            <MembershipRow item={item} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
}

render(<EditMembershipsPage />, document.getElementById("root-members"));
