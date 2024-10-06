import { useState } from 'react';

import { Edit, Person, Link as LinkIcon, Password } from '@mui/icons-material';
import { Avatar, Tab, Tabs, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { EditSocialLinkForm } from '#modules/social_link/view/shared/EditSocialLinkForm';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ChangePasswordTab } from './ChangePassword.tab';
import { EditProfileTab } from './EditProfile.tab';

export function ModalEditProfile({ onClose }: { onClose: () => void }) {
  const { palette } = useTheme();
  const { t } = useTranslation();
  const [tab, setTab] = useState('profile');
  const { socialLinks } = useCurrentUserData();
  const queryClient = useQueryClient();
  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="md">
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <Edit />
          </Avatar>
        }
      >
        {t('student.details.editProfile')}
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <Tabs
        onChange={(_, newVal) => setTab(newVal)}
        value={tab}
        allowScrollButtonsMobile
      >
        <Tab
          icon={<Person />}
          label={t('student.details.profile')}
          value={'profile'}
          iconPosition="start"
        />
        <Tab
          icon={<LinkIcon />}
          label={t('student.details.links')}
          value={'links'}
          iconPosition="start"
        />
        <Tab
          icon={<Password />}
          label={t('student.details.password')}
          value={'password'}
          iconPosition="start"
        />
      </Tabs>
      <ResponsiveDialogContent sx={{ height: 800 }}>
        {tab === 'profile' && <EditProfileTab />}
        {tab === 'links' && (
          <EditSocialLinkForm
            socialLinks={socialLinks}
            type="user"
            onSuccess={() =>
              queryClient.invalidateQueries(['student', 'current'])
            }
          />
        )}
        {tab === 'password' && <ChangePasswordTab />}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
