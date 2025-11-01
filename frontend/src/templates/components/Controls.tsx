import { useState } from 'react';

import {
  ArrowDropDown as DropDownIcon,
  ArrowDropUp as DropUpIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  SettingsBrightness as DeviceModeIcon,
} from '@mui/icons-material';
import { Button, IconButton, Tooltip } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useChangeThemeMode } from '#shared/context/CustomTheme.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { LanguageMenu } from './LanguageMenu';

export function Controls() {
  const { themeMode, changeThemeMode } = useChangeThemeMode();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { t, i18n } = useTranslation();

  const handleThemeToggle = () => {
    if (themeMode === 'auto') changeThemeMode('light');
    else if (themeMode === 'light') changeThemeMode('dark');
    else changeThemeMode('auto');
  };

  return (
    <FlexRow alignItems={'center'} justifyContent={'end'} gap={1}>
      <Tooltip title={t(`templates.theme.${themeMode}`)}>
        <IconButton onClick={handleThemeToggle}>
          {themeMode === 'dark' ? (
            <DarkModeIcon />
          ) : themeMode === 'light' ? (
            <LightModeIcon />
          ) : (
            <DeviceModeIcon />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip describeChild title={t('templates.changeLanguage')}>
        <Button
          endIcon={anchorEl ? <DropUpIcon /> : <DropDownIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          variant={'contained'}
          color={'secondary'}
          size={'small'}
        >
          {i18n.language}
        </Button>
      </Tooltip>
      <LanguageMenu anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
    </FlexRow>
  );
}
