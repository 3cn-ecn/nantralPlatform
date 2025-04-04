import { Divider, Tab, Tabs } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export type TabType = 'home' | 'members' | 'events' | 'posts' | 'adminRequests';

interface GroupTabBarProps {
  value: TabType;
  onChangeValue: (val: TabType) => void;
  group: Group;
}

export function GroupTabBar({ value, onChangeValue, group }: GroupTabBarProps) {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Tabs
        variant="scrollable"
        onChange={(_, newVal) => onChangeValue(newVal)}
        value={value}
        allowScrollButtonsMobile
        sx={{
          '.MuiTabs-scrollButtons.Mui-disabled': { opacity: 0.3 },
        }}
      >
        <Tab label={t('group.details.tabs.home')} value={'home'} />
        {isAuthenticated && (
          <Tab label={t('group.details.tabs.members')} value={'members'} />
        )}
        {isAuthenticated && (
          <Tab label={t('group.details.tabs.events')} value={'events'} />
        )}
        {isAuthenticated && (
          <Tab label={t('group.details.tabs.posts')} value={'posts'} />
        )}
        {isAuthenticated && group.isAdmin && (
          <Tab
            label={t('group.details.tabs.adminRequests')}
            value={'adminRequests'}
          />
        )}
      </Tabs>
      <Divider />
    </>
  );
}
