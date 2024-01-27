import { Collapse, Menu } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getNativeLanguageName } from '#shared/utils/getLanguageName';

import { MenuHeader } from './MenuHeader';
import { UserMenuItem } from './UserMenuItem';

interface LangSubMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onGoBack: () => void;
  onClose: () => void;
}

export function LangSubMenu({
  anchorEl,
  isOpen,
  onGoBack,
  onClose,
}: LangSubMenuProps) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

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
      <MenuHeader
        onGoBack={onGoBack}
        label={t('userMenu.menu.language.title')}
      />
      {languages.map((lng) => (
        <UserMenuItem
          key={lng}
          label={getNativeLanguageName(lng)}
          selected={i18n.language === lng}
          onClick={() => {
            i18n.changeLanguage(lng);
            queryClient.invalidateQueries();
            onClose();
          }}
        />
      ))}
    </Menu>
  );
}
