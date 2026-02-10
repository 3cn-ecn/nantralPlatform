import { Grid } from '@mui/material';

import { User } from '#modules/account/user.types';
import { Group } from '#modules/group/types/group.types';

import { Membership } from '../interfaces';
import CardMembership from './CardMembership';

/**
 * Main table component for editing members in the admin page of groups.
 */
function ListMembershipsGrid(props: {
  members: Membership[];
  group?: Group;
  student: User;
  updateMembership?: (member: Membership) => Promise<void>;
  deleteMembership?: (member: Membership) => Promise<void>;
}): JSX.Element {
  const { members, group, student, updateMembership, deleteMembership } = props;

  return (
    <Grid container spacing={1}>
      {members.map((item) => (
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
