import {
  DarkMode as DarkModeIcon,
  SettingsBrightness as DeviceModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { Collapse, Menu } from '@mui/material';

import { useChangeThemeMode } from '#shared/context/CustomTheme.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { MenuHeader } from './MenuHeader';
import { UserMenuItem } from './UserMenuItem';

interface ThemeSubMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onGoBack: () => void;
  onClose: () => void;
}

export function ThemeSubMenu({
  anchorEl,
  isOpen,
  onGoBack,
  onClose,
}: ThemeSubMenuProps) {
  const { t } = useTranslation();
  const { themeMode, changeThemeMode } = useChangeThemeMode();

  return (
    <Menu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onGoBack}
      TransitionComponent={Collapse}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { minWidth: 200 } } }}
    >
      <MenuHeader onGoBack={onGoBack} label={t('userMenu.menu.theme.title')} />
      <UserMenuItem
        label={t('userMenu.menu.theme.auto')}
        icon={<DeviceModeIcon />}
        selected={themeMode === 'auto'}
        onClick={() => {
          changeThemeMode('auto');
          onClose();
        }}
      />
      <UserMenuItem
        label={t('userMenu.menu.theme.light')}
        icon={<LightModeIcon />}
        selected={themeMode === 'light'}
        onClick={() => {
          changeThemeMode('light');
          onClose();
        }}
      />
      <UserMenuItem
        label={t('userMenu.menu.theme.dark')}
        icon={<DarkModeIcon />}
        selected={themeMode === 'dark'}
        onClick={() => {
          changeThemeMode('dark');
          onClose();
        }}
      />
    </Menu>
  );
}
