import { useState } from 'react';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { User } from '#modules/account/user.types';
import { Group } from '#modules/group/types/group.types';

import { Membership } from '../interfaces';
import Avatar from './Avatar';
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
  student: User;
  updateMembership?: (member: Membership) => Promise<void>;
  deleteMembership?: (member: Membership) => Promise<void>;
}) {
  const { item, group, student, updateMembership, deleteMembership } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card sx={{ height: '100%' }}>
        <CardActionArea
          onClick={() => setOpenShowModal(true)}
          sx={{ height: '100%' }}
        >
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}
          >
            <Avatar
              url={group ? item.user.picture : item.group.icon}
              title={group ? item.user.name : item.group.name}
              size="medium"
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body1" noWrap>
                {group ? item.user.name : item.group.name}
              </Typography>
              <Typography variant="body2" color="secondary" noWrap>
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
      {updateMembership && (
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
      )}
      {deleteMembership && (
        <ModalDeleteMember
          open={openDeleteModal}
          deleteMembership={deleteMembership}
          closeModal={() => setOpenDeleteModal(false)}
          member={item}
        />
      )}
    </Grid>
  );
}

export default MembershipCard;
