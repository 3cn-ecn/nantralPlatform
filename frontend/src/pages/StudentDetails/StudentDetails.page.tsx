import { useParams } from 'react-router-dom';

import { Container, Divider, Typography } from '@mui/material';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { StudentGroupsSection } from './components/Section/StudentGroupSection';
import { StudentDetailsInfo } from './components/StudentDetailsInfo';
import { StudentEditButton } from './components/StudentEditButton';
import { useUserDetails } from './hooks/useUserDetails';

export default function StudentDetailsPage() {
  const { id } = useParams();
  const { isLoading, data: user } = useUserDetails(id);

  const currentUser = useCurrentUserData();

  if (isLoading || !user) {
    return;
  }

  const isMe = user.id === currentUser.id;

  return (
    <Container sx={{ my: 3 }}>
      <FlexRow flexWrap={'wrap'} gap={3}>
        <Avatar alt={user.name} src={user.picture} size="xxl"></Avatar>
        <StudentDetailsInfo user={user} />
      </FlexRow>
      <Typography sx={{ lineBreak: 'anywhere' }} my={2}>
        {user.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <StudentGroupsSection user={user} />
      <Spacer vertical={10} />
      {(isMe || currentUser.admin) && <StudentEditButton user={user} />}
    </Container>
  );
}
