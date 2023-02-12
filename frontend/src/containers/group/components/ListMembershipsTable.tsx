import React, { useState } from 'react';
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
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
import Avatar from './Avatar';
import ModalDisplayMember from './ModalDisplayMember';
import ModalEditMember from './ModalEditMember';
import ModalDeleteMember from './ModalDeleteMember';
import { Group, Membership, Student } from '../interfaces';


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
  student: Student;
  updateMembership: (member: Membership) => Promise<void>;
  deleteMembership: (member: Membership) => Promise<void>;
}) {
  const {
    item,
    index,
    group,
    student,
    updateMembership,
    deleteMembership
  } = props;
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
      <ModalDisplayMember
        open={openShowModal}
        closeModal={() => setOpenShowModal(false)}
        openEditModal={() => { setOpenShowModal(false); setOpenEditModal(true); }}
        member={item}
        group={group}
      />
      <ModalEditMember
        open={openEditModal}
        saveMembership={updateMembership}
        closeModal={() => setOpenEditModal(false)}
        openDeleteModal={() => { setOpenEditModal(false); setOpenDeleteModal(true); }}
        member={item}
        group={group}
        student={student}
      />
      <ModalDeleteMember
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
function ListMembershipsTable(props: {
  members: Membership[],
  group: Group,
  student: Student,
  reorderMemberships: (reorderedMembers: Membership[], member: Membership, lower?: Membership) => Promise<void>,
  updateMembership: (member: Membership) => Promise<void>,
  deleteMembership: (member: Membership) => Promise<void>,
}): JSX.Element {
  const {
    members,
    group,
    student,
    reorderMemberships,
    updateMembership,
    deleteMembership
  } = props;

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
    const reorderedMembers = reorder(members, source, dest);
    reorderMemberships(
      reorderedMembers,
      members[source],
      dest + 1 < members.length ? reorderedMembers[dest + 1] : undefined
    );
  };

  return (
    <TableContainer component={Paper}>
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
              student={student!!}
              key={item.id}
              updateMembership={updateMembership}
              deleteMembership={deleteMembership}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ListMembershipsTable;
