import { AdminPanelSettings } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';

import { SocialLinkItem } from '#modules/social_link/view/shared/SocialLinkItem';
import { Curriculum, Faculties, Student } from '#modules/student/student.types';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function StudentDetailsInfo({ student }: { student: Partial<Student> }) {
  const { t } = useTranslation();
  return (
    <FlexCol>
      <FlexRow alignItems="center" gap={2}>
        <Typography variant="h1" pb={0}>
          {student.name}
        </Typography>
        {student?.staff && (
          <AdminPanelSettings fontSize="large" color="secondary" />
        )}
      </FlexRow>
      <Typography color="gray" mb={1}>
        @{student.username}
      </Typography>
      <FlexRow flexWrap={'wrap'} gap={1}>
        <Chip label={`Année d'entrée: ${student.promo}`}></Chip>
        {student.faculty && <Chip label={t(Faculties[student.faculty])}></Chip>}
        {student.path && student.path !== 'Cla' && (
          <Chip label={t(Curriculum[student.path])}></Chip>
        )}
      </FlexRow>
      <FlexRow my={1} flexWrap={'wrap'}>
        {student.socialLinks?.map((link) => (
          <SocialLinkItem key={link.id} socialLink={link} />
        ))}
      </FlexRow>
    </FlexCol>
  );
}
