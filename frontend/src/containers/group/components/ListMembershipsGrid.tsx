import React from 'react';
import { Grid } from '@mui/material';
import CardMembership from './CardMembership';
import { Group, Membership, Student } from '../interfaces';


/**
 * Main table component for editing members in the admin page of groups.
 */
function ListMembershipsGrid(props: {
  members: Membership[],
  group: Group,
  student: Student,
  updateMembership: (member: Membership) => Promise<void>,
  deleteMembership: (member: Membership) => Promise<void>,
}): JSX.Element {

  const { members, group, student, updateMembership, deleteMembership } = props;

  return (
    <Grid container spacing={2}>
      {members.map((item, index) => (
        <CardMembership
          item={item}
          group={group}
          student={student}
          key={item.id}
          updateMembership={updateMembership}
          deleteMembership={deleteMembership}
        />
      ))}
    </Grid>
  );
}

export default ListMembershipsGrid;
