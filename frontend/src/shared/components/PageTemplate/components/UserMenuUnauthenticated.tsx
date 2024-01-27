import {
  ComponentProps,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import {
  ArrowBack as ArrowBackIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as DeviceModeIcon,
  Gavel as LegalIcon,
  LightMode as LightModeIcon,
  Login as LoginIcon,
  MenuBook as MenuBookIcon,
  NavigateNext as NavigateNextIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import {
  Collapse,
  Divider,
  Icon,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemTypeMap,
  Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useQueryClient } from '@tanstack/react-query';

import { useChangeThemeMode } from '#shared/context/CustomTheme.context';
import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getNativeLanguageName } from '#shared/utils/getLanguageName';

export function UserMenuUnauthenticated() {
  const { t, i18n } = useTranslation();
  const { themeMode, changeThemeMode } = useChangeThemeMode();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<null | 'main' | 'theme' | 'lang'>(
    null,
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen('main');
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label={t('userMenu.button.label')}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Icon
          component="img"
          src="/static/img/icons/cropped/people.svg"
          alt="Ouvrir le Menu Profil"
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen === 'main'}
        onClose={() => setMenuOpen(null)}
        TransitionComponent={Collapse}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <CustomMenuItem
          label={t('userMenu.menu.signIn')}
          icon={<LoginIcon />}
          component={Link}
          to="/account/login/"
          reloadDocument
          onClick={() => setMenuOpen(null)}
        />
        <Divider />
        <CustomMenuItem
          label={t('userMenu.menu.language.title')}
          icon={<TranslateIcon />}
          rightIcon={<NavigateNextIcon />}
          onClick={() => setMenuOpen('lang')}
        />
        <CustomMenuItem
          label={t('userMenu.menu.theme.title')}
          icon={<DarkModeIcon />}
          rightIcon={<NavigateNextIcon />}
          onClick={() => setMenuOpen('theme')}
        />
        <Divider />
        <CustomMenuItem
          label={t('userMenu.menu.documentation')}
          icon={<MenuBookIcon />}
          component={Link}
          to="https://docs.nantral-platform.fr/"
          reloadDocument
          onClick={() => setMenuOpen(null)}
        />
        <CustomMenuItem
          label={t('userMenu.menu.legalNotice')}
          icon={<LegalIcon />}
          component={Link}
          to="/legal-notice/"
          onClick={() => setMenuOpen(null)}
        />
      </Menu>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen === 'lang'}
        onClose={() => setMenuOpen('main')}
        TransitionComponent={Collapse}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <MenuHeader
          setMenuOpen={setMenuOpen}
          label={t('userMenu.menu.language.title')}
        />
        {languages.map((lng) => (
          <CustomMenuItem
            key={lng}
            label={getNativeLanguageName(lng)}
            selected={i18n.language === lng}
            onClick={() => {
              i18n.changeLanguage(lng);
              queryClient.invalidateQueries();
              setMenuOpen(null);
            }}
          />
        ))}
      </Menu>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen === 'theme'}
        onClose={() => setMenuOpen('main')}
        TransitionComponent={Collapse}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <MenuHeader
          setMenuOpen={setMenuOpen}
          label={t('userMenu.menu.theme.title')}
        />
        <CustomMenuItem
          label={t('userMenu.menu.theme.auto')}
          icon={<DeviceModeIcon />}
          selected={themeMode === 'auto'}
          onClick={() => {
            changeThemeMode('auto');
            setMenuOpen(null);
          }}
        />
        <CustomMenuItem
          label={t('userMenu.menu.theme.light')}
          icon={<LightModeIcon />}
          selected={themeMode === 'light'}
          onClick={() => {
            changeThemeMode('light');
            setMenuOpen(null);
          }}
        />
        <CustomMenuItem
          label={t('userMenu.menu.theme.dark')}
          icon={<DarkModeIcon />}
          selected={themeMode === 'dark'}
          onClick={() => {
            changeThemeMode('dark');
            setMenuOpen(null);
          }}
        />
      </Menu>
    </>
  );
}

type CustomMenuItemComponent = OverridableComponent<
  MenuItemTypeMap<
    { label: string; icon?: ReactNode; rightIcon?: ReactNode },
    'li'
  >
>;
const CustomMenuItem: CustomMenuItemComponent = ({
  label,
  icon,
  rightIcon,
  ...props
}: ComponentProps<CustomMenuItemComponent>) => {
  return (
    <MenuItem {...props}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{label}</ListItemText>
      {rightIcon}
    </MenuItem>
  );
};

interface MenuHeaderProps {
  setMenuOpen: Dispatch<SetStateAction<string | null>>;
  label: string;
}
const MenuHeader = ({ setMenuOpen, label }: MenuHeaderProps) => {
  return (
    <ListItem>
      <ListItemIcon>
        <IconButton onClick={() => setMenuOpen('main')}>
          <ArrowBackIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText>
        <Typography variant="h6">{label}</Typography>
      </ListItemText>
    </ListItem>
  );
};
