import {
  ComponentProps,
  Dispatch,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

import {
  ArrowBack as ArrowBackIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as DeviceModeIcon,
  FeedbackOutlined as FeedbackIcon,
  Gavel as LegalIcon,
  LightMode as LightModeIcon,
  LogoutRounded as LogoutIcon,
  MenuBook as MenuBookIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
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

import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useChangeThemeMode } from '#shared/context/CustomTheme.context';
import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getNativeLanguageName } from '#shared/utils/getNativeLanguageName';

export function UserMenu() {
  const { t, i18n } = useTranslation();
  const { themeMode, changeThemeMode } = useChangeThemeMode();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<null | 'main' | 'theme' | 'lang'>(
    null
  );

  const currentUser = useCurrentUserData();

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
        sx={currentUser.picture ? { p: 0.5 } : {}}
      >
        {currentUser.picture ? (
          <Avatar alt={currentUser.name} src={currentUser.picture} />
        ) : (
          <Icon>
            <img
              src="/static/img/icons/cropped/people.svg"
              alt="Ouvrir le Menu Profil"
            />
          </Icon>
        )}
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
          label={t('userMenu.menu.profile')}
          icon={<PersonIcon />}
          component={Link}
          to={`/student/${currentUser.id}`}
          reloadDocument
        />
        <CustomMenuItem
          label={t('userMenu.menu.signOut')}
          icon={<LogoutIcon />}
          component={Link}
          to="/account/logout/"
          reloadDocument
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
        {currentUser.staff && (
          <CustomMenuItem
            label={t('userMenu.menu.adminInterface')}
            icon={<SecurityIcon />}
            component={Link}
            to="/admin"
            reloadDocument
          />
        )}
        <CustomMenuItem
          label={t('userMenu.menu.report')}
          icon={<FeedbackIcon />}
          component={Link}
          to="/suggestions"
          reloadDocument
        />
        <CustomMenuItem
          label={t('userMenu.menu.documentation')}
          icon={<MenuBookIcon />}
          component={Link}
          to="https://docs.nantral-platform.fr/"
          reloadDocument
        />
        <CustomMenuItem
          label={t('userMenu.menu.legalNotice')}
          icon={<LegalIcon />}
          component={Link}
          to="/legal-notice/"
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
          onClick={() => changeThemeMode('auto')}
        />
        <CustomMenuItem
          label={t('userMenu.menu.theme.light')}
          icon={<LightModeIcon />}
          selected={themeMode === 'light'}
          onClick={() => changeThemeMode('light')}
        />
        <CustomMenuItem
          label={t('userMenu.menu.theme.dark')}
          icon={<DarkModeIcon />}
          selected={themeMode === 'dark'}
          onClick={() => changeThemeMode('dark')}
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

type MenuHeaderProps = {
  setMenuOpen: Dispatch<SetStateAction<string | null>>;
  label: string;
};
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
