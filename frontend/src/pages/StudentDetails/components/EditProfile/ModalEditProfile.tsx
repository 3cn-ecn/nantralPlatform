import { useState } from 'react';

import { Edit, Person, Link as LinkIcon } from '@mui/icons-material';
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

import { EditProfileTab } from './EditProfile.tab';

export function ModalEditProfile({ onClose }: { onClose: () => void }) {
  const { palette } = useTheme();

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
        Modifier le profile
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <Tabs
        onChange={(_, newVal) => setTab(newVal)}
        value={tab}
        allowScrollButtonsMobile
      >
        <Tab
          icon={<Person />}
          label="Profile"
          value={'profile'}
          iconPosition="start"
        />
        <Tab
          icon={<LinkIcon />}
          label="Socials"
          value={'links'}
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
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
