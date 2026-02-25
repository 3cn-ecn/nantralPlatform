import { AdminPanelSettings } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';

import { Curriculum, Faculties, User } from '#modules/account/user.types';
import { SocialLinkItem } from '#modules/social_link/view/shared/SocialLinkItem';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export function StudentDetailsInfo({ user }: { user: Partial<User> }) {
  const { t } = useTranslation();
  return (
    <FlexCol>
      <FlexRow alignItems="center" gap={2}>
        <Typography variant="h1" pb={0}>
          {user.name}
        </Typography>
        {user?.staff && (
          <AdminPanelSettings fontSize="large" color="secondary" />
        )}
      </FlexRow>
      <FlexRow flexWrap={'wrap'} gap={1}>
        <Chip label={`Année d'entrée: ${user.promo}`}></Chip>
        {user.faculty && <Chip label={t(Faculties[user.faculty])}></Chip>}
        {user.path && user.path !== 'Cla' && (
          <Chip label={t(Curriculum[user.path])}></Chip>
        )}
      </FlexRow>
      <FlexRow my={1} flexWrap={'wrap'}>
        <SocialLinkItem
          socialLink={{
            uri:
              'https://matrix.to/#/@' + user.username + ':nantral-platform.fr',
            label: t('student.details.matrix', { username: user.username }),
          }}
        />
        {user.emails?.map((email) => (
          <SocialLinkItem
            key={email}
            socialLink={{ uri: 'mailto:' + email, label: email }}
          />
        ))}
        {user.socialLinks?.map((link) => (
          <SocialLinkItem key={link.id} socialLink={link} />
        ))}
      </FlexRow>
    </FlexCol>
  );
}
