import { Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getHousingMembershipListApi } from '#modules/roommates/api/getHousingMembershipList.api';
import { Student } from '#modules/student/student.types';
import { MembersGrid } from '#pages/GroupDetails/GroupMembers/MembersGrid';
import { useTranslation } from '#shared/i18n/useTranslation';

export function StudentHousingSection({ student }: { student: Student }) {
  const { t } = useTranslation();
  const housingQuery = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getHousingMembershipListApi({ student: student.id, page: pageParam }),
    queryKey: ['housing', 'membership', { student: student.id }],
  });

  if (
    housingQuery.isLoading ||
    (housingQuery.isSuccess && housingQuery.data.pages[0].count === 0)
  ) {
    return;
  }

  return (
    <>
      <Typography variant="h2">{t('student.details.housing')}</Typography>
      <MembersGrid query={housingQuery} />
    </>
  );
}
