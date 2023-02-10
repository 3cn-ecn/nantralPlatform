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
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggingStyle,
  NotDraggingStyle
} from 'react-beautiful-dnd';
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
function reorder(list: Membership[], startIndex: number, endIndex: number): Membership[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Change item style when dragged.
 *
 * @param isDragging 
 * @param draggableStyle 
 * @returns new style of the item
 */
function getItemStyle(
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle
): DraggingStyle | NotDraggingStyle {
  return {
    // styles we need to apply on draggables
    ...draggableStyle,
    ...(isDragging && {
      background: "rgb(235,235,235)",
    }),
  };
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
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
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
function DroppableComponent(onDragEnd: (result, provided) => void) {
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

function MembershipAdminTable(props: {}): JSX.Element {
  const [members, setMembers] = useState<Membership[]>([]);
  const [loadState, setLoadState] = useState<'load' | 'success' | 'fail'>('load');
  const [params, setParams] = useState({
    group: groupSlug,
    from: new Date().toISOString(),
    to: null
  });
  const [message, setMessage] = useState({ open: false, type: null, text: '' });
  
  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    axios.get<Membership[]>('/api/group/membership/', {params})  // get data
    .then((res) => res.data.map((item) => {  // map each item to add dragId
      item.dragId = `item-${item.id}`;
      return item;
    }))
    .then((list) => {  // update members variables
      setMembers(list);
      setLoadState('success');
    })
    .catch(() => setLoadState('fail'));  // error case
  }

  async function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) return;
    const source = result.source.index;
    const dest = result.destination.index;
    const r_members = reorder(members, source, dest);
    axios.post('/api/group/membership/reorder/', {
      member: members[source].id,
      higher: dest > 0 ? r_members[dest - 1].id : null,
      lower: dest + 1 < members.length ? r_members[dest + 1].id : null
    }, {params})
    .then(() => setMessage({ open: true, type: 'success', text: 'Reordering saved!'}))
    .catch(() => setMessage({ open: true, type: 'error', text: 'An error occurred while reordering...'}))
    setMembers(r_members);
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
          </TableRow>
        </TableHead>
        <TableBody component={DroppableComponent(onDragEnd)}>
          {members.map((item, index) => (
            <TableRow
              component={DraggableComponent(item.dragId, index)}
              key={item.id}
            >
              <TableCell scope="row"><DragIndicatorIcon color='disabled' /></TableCell>
              <TableCell>{item.student.full_name}</TableCell>
              <TableCell style={{textOverflow: 'ellipsis'}}>{item.summary}</TableCell>
              <TableCell>{
                item.admin ?
                  <CheckCircleIcon color='success' />
                : item.admin_request ?
                  <HelpIcon color='warning' />
                : <></>
              }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
}

render(<MembershipAdminTable />, document.getElementById("root-members"));
