import { AdminPanelSettings } from '@mui/icons-material';
import { Chip, Stack, Typography } from '@mui/material';

import { Curriculum, Faculties, User } from '#modules/account/user.types';
import { SocialLinkItem } from '#modules/social_link/view/shared/SocialLinkItem';
import { useTranslation } from '#shared/i18n/useTranslation';

export function StudentDetailsInfo({ user }: { user: Partial<User> }) {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
        <Typography variant="h1" sx={{ pb: 0 }}>
          {user.name}
        </Typography>
        {user?.staff && (
          <AdminPanelSettings fontSize="large" color="secondary" />
        )}
      </Stack>
      <Stack direction="row" sx={{ flexWrap: 'wrap' }} spacing={1}>
        <Chip label={`Année d'entrée: ${user.promo}`}></Chip>
        {user.faculty && <Chip label={t(Faculties[user.faculty])}></Chip>}
        {user.path && user.path !== 'Cla' && (
          <Chip label={t(Curriculum[user.path])}></Chip>
        )}
      </Stack>
      <Stack direction="row" sx={{ my: 1, flexWrap: 'wrap' }}>
        <SocialLinkItem
          socialLink={{
            uri: `@${user.username}:nantral-platform.fr`,
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
      </Stack>
    </Stack>
  );
}
