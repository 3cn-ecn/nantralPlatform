import { useState } from 'react';

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  OnDragEndResponder,
} from '@hello-pangea/dnd';
import {
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  DragIndicator as DragIndicatorIcon,
  Edit as EditIcon,
  Help as HelpIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { User } from '#modules/account/user.types';
import { Group } from '#modules/group/types/group.types';

import { Membership } from '../interfaces';
import Avatar from './Avatar';
import ModalArchiveMember from './ModalArchiveMember';
import ModalDeleteMember from './ModalDeleteMember';
import ModalDisplayMember from './ModalDisplayMember';
import ModalEditMember from './ModalEditMember';

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
}

/**
 * A function that returns a draggable component
 *
 * @param id - the id of the element
 * @param index - the index for ordering the elements
 * @returns A component
 */
function DraggableComponent(id: string, index: number) {
  return function DraggableComponent(props: any): JSX.Element {
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
                background: 'rgb(235,235,235)',
              }),
            }}
            {...props}
          >
            {props.children}
          </TableRow>
        )}
      </Draggable>
    );
  };
}

/**
 * A function that returns a droppable component
 *
 * @param onDragEnd - function to use after dragging
 * @returns A component
 */
function DroppableComponent(onDragEnd: OnDragEndResponder) {
  return function DroppableComponent(props: any): JSX.Element {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="1" direction="vertical">
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
}

/** An admin badge for the cells of admin columns. */
function AdminBadge(props: { item: Membership }): JSX.Element {
  const { item } = props;
  if (item.admin) return <CheckCircleIcon color="success" />;
  if (item.admin_request) return <HelpIcon color="warning" />;
  return <></>;
}

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
  student: User;
  updateMembership: (member: Membership, reload?: boolean) => Promise<void>;
  deleteMembership: (member: Membership) => Promise<void>;
}): JSX.Element {
  const { item, index, group, student, updateMembership, deleteMembership } =
    props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const today = new Date().toISOString();

  return (
    <TableRow component={DraggableComponent(item.dragId, index)}>
      <TableCell scope="row" sx={{ width: 0 }}>
        <DragIndicatorIcon color="disabled" />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar url={item.user.picture} title={item.user.name} size="small" />
          <Typography noWrap fontWeight="lg">
            {item.user.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{item.summary}</TableCell>
      <TableCell>
        <AdminBadge item={item} />
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            title="Ouvrir"
            aria-label="show"
            size="small"
            onClick={() => setOpenShowModal(true)}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            title="Modifier"
            aria-label="edit"
            size="small"
            onClick={() => setOpenEditModal(true)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            title="Archiver"
            aria-label="archive"
            size="small"
            onClick={() => setOpenArchiveModal(true)}
            hidden={group.groupType.noMembershipDates || item.end_date < today}
          >
            <ArchiveIcon fontSize="small" />
          </IconButton>
        </Box>
        <ModalDisplayMember
          open={openShowModal}
          closeModal={() => setOpenShowModal(false)}
          openEditModal={() => {
            setOpenShowModal(false);
            setOpenEditModal(true);
          }}
          member={item}
          group={group}
          student={student}
        />
        <ModalEditMember
          open={openEditModal}
          saveMembership={updateMembership}
          closeModal={() => setOpenEditModal(false)}
          openDeleteModal={() => {
            setOpenEditModal(false);
            setOpenDeleteModal(true);
          }}
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
        <ModalArchiveMember
          open={openArchiveModal}
          saveMembership={updateMembership}
          closeModal={() => setOpenArchiveModal(false)}
          member={item}
        />
      </TableCell>
    </TableRow>
  );
}

/**
 * Main table component for editing members in the admin page of groups.
 */
function ListMembershipsTable(props: {
  members: Membership[];
  group: Group;
  student: User;
  reorderMemberships: (
    reorderedMembers: Membership[],
    member: Membership,
    lower?: Membership,
  ) => Promise<void>;
  updateMembership: (member: Membership, reload?: boolean) => Promise<void>;
  deleteMembership: (member: Membership) => Promise<void>;
}): JSX.Element {
  const {
    members,
    group,
    student,
    reorderMemberships,
    updateMembership,
    deleteMembership,
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
      dest + 1 < members.length ? reorderedMembers[dest + 1] : undefined,
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
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
              group={group}
              student={student}
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
