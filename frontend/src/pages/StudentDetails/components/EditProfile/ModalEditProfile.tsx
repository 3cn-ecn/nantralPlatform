import { useSearchParams } from 'react-router-dom';

import {
  AlternateEmail,
  Edit,
  Link as LinkIcon,
  Password,
  Person,
} from '@mui/icons-material';
import { Avatar, Tab, Tabs, useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { User } from '#modules/account/user.types';
import { EditSocialLinkForm } from '#modules/social_link/view/shared/EditSocialLinkForm';
import EmailTab from '#pages/StudentDetails/components/EditProfile/Email.tab';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ChangePasswordTab } from './ChangePassword.tab';
import { EditProfileTab } from './EditProfile.tab';

export enum TabType {
  'profile',
  'emails',
  'links',
  'password',
}

export function ModalEditProfile({
  onClose,
  user,
}: {
  onClose: () => void;
  user: User;
}) {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'profile';
  const { palette } = useTheme();
  const { t } = useTranslation();
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
        onChange={(_, newVal) => {
          params.set('tab', newVal);
          setParams(params);
        }}
        value={tab}
        variant={'scrollable'}
        scrollButtons={false}
      >
        <Tab
          icon={<Person />}
          label={t('student.details.profile')}
          value={'profile'}
          iconPosition="start"
        />
        <Tab
          icon={<AlternateEmail />}
          label={t('student.details.emails')}
          value={'emails'}
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
        {tab === 'profile' && <EditProfileTab user={user} />}
        {tab === 'emails' && <EmailTab userId={user.id} />}
        {tab === 'links' && (
          <EditSocialLinkForm
            socialLinks={user.socialLinks}
            userId={user.id}
            onSuccess={() => {
              queryClient.invalidateQueries({
                queryKey: ['user', { id: user.id.toString() }],
              });
              queryClient.invalidateQueries({ queryKey: ['user', 'current'] });
            }}
          />
        )}
        {tab === 'password' && <ChangePasswordTab />}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
