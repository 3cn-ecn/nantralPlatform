import { useState } from 'react';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { Avatar } from '#shared/components/Avatar/Avatar';

import { Group, Membership, Student } from '../interfaces';
import ModalDeleteMember from './ModalDeleteMember';
import ModalDisplayMember from './ModalDisplayMember';
import ModalEditMember from './ModalEditMember';

/**
 * A row of the table with a membership
 *
 * @param props
 * @returns
 */
function MembershipCard(props: {
  item: Membership;
  group?: Group;
  student: Student;
  updateMembership?: (member: Membership) => Promise<void>;
  deleteMembership?: (member: Membership) => Promise<void>;
}) {
  const { item, group, student, updateMembership, deleteMembership } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardActionArea onClick={() => setOpenShowModal(true)}>
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}
          >
            <Avatar
              src={group ? item.student.picture : item.group.icon}
              alt={group ? item.student.full_name : item.group.name}
              size="l"
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 500 }} noWrap>
                {group ? item.student.full_name : item.group.name}
              </Typography>
              <Typography
                sx={{ fontSize: '0.9em' }}
                color="text.secondary"
                noWrap
              >
                {item.summary}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
      <ModalDisplayMember
        open={openShowModal}
        closeModal={() => setOpenShowModal(false)}
        openEditModal={
          updateMembership
            ? () => {
                setOpenShowModal(false);
                setOpenEditModal(true);
              }
            : undefined
        }
        member={item}
        group={group}
        student={student}
      />
      <ModalEditMember
        open={openEditModal}
        closeModal={() => setOpenEditModal(false)}
        saveMembership={updateMembership}
        openDeleteModal={
          deleteMembership
            ? () => {
                setOpenEditModal(false);
                setOpenDeleteModal(true);
              }
            : undefined
        }
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
    </Grid>
  );
}

export default MembershipCard;
