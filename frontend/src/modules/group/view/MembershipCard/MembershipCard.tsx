import { useState } from 'react';

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { Avatar } from '#shared/components/Avatar/Avatar';

import { ModalDeleteMember } from '../Modal/ModalDeleteMember';
import { ModalShowMember } from '../Modal/ModalDisplayMember';
import { ModalEditMembership } from '../Modal/ModalEditMembership';

/**
 * A row of the table with a membership
 *
 * @param props
 * @returns
 */
function MembershipCard(props: {
  item: Membership;
  group?: Group;
  updateMembership?: (member: Membership) => Promise<void>;
  deleteMembership?: (member: Membership) => Promise<void>;
}) {
  const { item, group, deleteMembership } = props;
  const [openShowModal, setOpenShowModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card
        variant={'elevation'}
        sx={{ height: '100%', borderColor: 'primary' }}
      >
        <CardActionArea
          onClick={() => setOpenShowModal(true)}
          sx={{ height: '100%' }}
        >
          <CardContent
            sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}
          >
            <Avatar
              src={group ? item.user.picture : item.group.icon}
              alt={group ? item.user.name : item.group.name}
              size="m"
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
      <ModalShowMember
        open={openShowModal}
        closeModal={() => setOpenShowModal(false)}
        openEditModal={() => {
          setOpenShowModal(false);
          setOpenEditModal(true);
        }}
        member={item}
        group={group}
        user={item.user}
      />

      {openEditModal && group && (
        <ModalEditMembership
          group={group}
          onClose={() => setOpenEditModal(false)}
          membership={item}
        />
      )}

      {deleteMembership && (
        <ModalDeleteMember
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          member={item}
        />
      )}
    </Grid>
  );
}

export default MembershipCard;
