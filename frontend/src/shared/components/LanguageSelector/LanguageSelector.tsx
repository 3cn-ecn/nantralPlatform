import { MouseEvent, useState } from 'react';

import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import { uniq } from 'lodash-es';

import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getLanguageName } from '#shared/utils/getLanguageName';

const base_languages = uniq(languages.map((lg) => lg.split('-')[0]));

interface LanguageSelectorProps {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
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
        {base_languages.map((language) => (
          <MenuItem
            key={language}
            value={language}
            onClick={() => {
              setSelectedLang(language);
              handleClose();
            }}
            selected={language === selectedLang}
          >
            {getLanguageName(language, i18n.language)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
