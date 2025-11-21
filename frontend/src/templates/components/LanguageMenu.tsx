import { Menu, MenuItem } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';

export function LanguageMenu({
  anchorEl,
  onClose,
}: {
  anchorEl: Element | null;
  onClose: () => void;
}) {
  const { i18n } = useTranslation();
  const opened = Boolean(anchorEl);
  const queryClient = useQueryClient();
  return (
    <Menu open={opened} anchorEl={anchorEl} onClose={onClose}>
      {languages.map((language) => (
        <MenuItem
          key={language}
          selected={language === i18n.language}
          onClick={() => {
            i18n.changeLanguage(language);
            queryClient.invalidateQueries();
            onClose();
          }}
        >
          {language}
        </MenuItem>
      ))}
    </Menu>
  );
}
