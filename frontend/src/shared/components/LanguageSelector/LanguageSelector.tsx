import { Dispatch, MouseEvent, useState } from 'react';

import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';

import { BaseLanguage, baseLanguages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getLanguageName } from '#shared/utils/getLanguageName';

interface LanguageSelectorProps {
  selectedLang: BaseLanguage;
  setSelectedLang: Dispatch<BaseLanguage>;
}

export function LanguageSelector({
  selectedLang,
  setSelectedLang,
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedLang}
      </Button>
      <Menu anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
        {baseLanguages.map((baseLang) => (
          <MenuItem
            key={baseLang}
            value={baseLang}
            onClick={() => {
              setSelectedLang(baseLang);
              handleClose();
            }}
            selected={baseLang === selectedLang}
          >
            {getLanguageName(baseLang, i18n.language)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
