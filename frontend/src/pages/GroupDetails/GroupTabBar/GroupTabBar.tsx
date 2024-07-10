import { Divider, Tab, Tabs } from '@mui/material';

import { useAuth } from '#shared/context/Auth.context';

export type GroupDetailsTabs = 'home' | 'members' | 'events' | 'posts';

interface GroupTabBarProps {
  value: string;
  onChangeValue: (val: string) => void;
}

export function GroupTabBar({ value, onChangeValue }: GroupTabBarProps) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <Tabs
        variant="scrollable"
        onChange={(_, newVal) => onChangeValue(newVal)}
        value={value}
        allowScrollButtonsMobile
      >
        <Tab label={'Home'} value={'home'} />
        {isAuthenticated && (
          <Tab label={'Membres'} disabled={false} value={'members'} />
        )}

        {isAuthenticated && (
          <Tab label={'Événements'} disabled={false} value={'events'} />
        )}
        {isAuthenticated && (
          <Tab label={'Annonces'} disabled={false} value={'posts'} />
        )}
      </Tabs>
      <Divider />
    </>
  );
}
