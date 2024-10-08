import { Divider, Tab, Tabs } from '@mui/material';

import { Group } from '#modules/group/types/group.types';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export type GroupDetailsTabs = 'home' | 'members' | 'events' | 'posts';

interface GroupTabBarProps {
  value: string;
  onChangeValue: (val: string) => void;
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
      >
        <Tab label={t('group.details.tabs.home')} value={'home'} />
        {isAuthenticated && (
          <Tab
            label={t('group.details.tabs.members')}
            disabled={false}
            value={'members'}
          />
        )}

        {isAuthenticated && (
          <Tab
            label={t('group.details.tabs.events')}
            disabled={false}
            value={'events'}
          />
        )}
        {isAuthenticated && (
          <Tab
            label={t('group.details.tabs.posts')}
            disabled={false}
            value={'posts'}
          />
        )}
        {isAuthenticated && group.isAdmin && (
          <Tab
            label={t('group.details.tabs.adminRequests')}
            disabled={false}
            value={'adminRequests'}
          />
        )}
      </Tabs>
      <Divider />
    </>
  );
}
