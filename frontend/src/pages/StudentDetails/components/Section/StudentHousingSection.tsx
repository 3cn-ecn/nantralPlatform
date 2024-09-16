import { Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getHousingMembershipListApi } from '#modules/roommates/api/getHousingMembershipList.api';
import { Student } from '#modules/student/student.types';
import { MembersGrid } from '#pages/GroupDetails/GroupMembers/MembersGrid';

export function StudentHousingSection({ student }: { student: Student }) {
  const housingQuery = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getHousingMembershipListApi({ student: student.id, page: pageParam }),
    queryKey: ['housing', 'membership', { student: student.id }],
  });

  if (housingQuery.isSuccess && housingQuery.data.pages[0].count === 0) {
    return;
  }

  return (
    <>
      <Typography variant="h2">Collocation</Typography>
      <MembersGrid query={housingQuery} />
    </>
  );
}
