import { useParams } from 'react-router-dom';

import { Container, Divider, Typography } from '@mui/material';

import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { StudentGroupsSection } from './components/Section/StudentGroupSection';
import { StudentHousingSection } from './components/Section/StudentHousingSection';
import { StudentDetailsInfo } from './components/StudentDetailsInfo';
import { StudentEditButton } from './components/StudentEditButton';
import { useStudentDetails } from './hooks/useStudentDetails';

export default function StudentDetailsPage() {
  const { id } = useParams();
  const isMe = id === 'me';

  const { isLoading, data: student } = useStudentDetails(id);

  if (isLoading || !student) {
    return;
  }

  return (
    <Container sx={{ my: 3 }}>
      <FlexRow flexWrap={'wrap'} gap={3}>
        <Avatar alt={student.name} src={student.picture} size="xxl"></Avatar>
        <StudentDetailsInfo student={student} />
      </FlexRow>
      <Typography sx={{ lineBreak: 'anywhere' }} my={2}>
        {student.description}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <StudentHousingSection student={student} />
      <StudentGroupsSection student={student} />
      <Spacer vertical={10} />
      {isMe && <StudentEditButton />}
    </Container>
  );
}
