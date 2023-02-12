import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import Avatar from './Avatar';
import ShowMemberModal from './ShowMemberModal';
import EditMemberModal from './EditMemberModal';
import DeleteMemberModal from './DeleteMemberModal';
import { Membership, Group } from '../interfaces';

/**
 * A row of the table with a membership
 * 
 * @param props 
 * @returns 
 */
function MembershipCard(props: {
  item: Membership;
  group: Group,
  updateMembership: (member: Membership) => Promise<void>,
  deleteMembership: (member: Membership) => Promise<void>;
}) {
  const { item, group, updateMembership, deleteMembership } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardActionArea onClick={() => setOpenShowModal(true)}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
            <Avatar url={item.student.picture} title={item.student.full_name} size='large' />
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
        closeModal={() => setOpenShowModal(false)}
        openEditModal={() => { setOpenShowModal(false); setOpenEditModal(true); }}
        member={item}
        group={group}
      />
      <EditMemberModal
        open={openEditModal}
        closeModal={() => setOpenEditModal(false)}
        saveMembership={updateMembership}
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
    </Grid>
  );
};

export default MembershipCard;