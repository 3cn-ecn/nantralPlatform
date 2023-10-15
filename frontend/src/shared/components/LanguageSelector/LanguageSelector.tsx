import { useState, MouseEvent, Dispatch } from 'react';

import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';

import { base_languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getLanguageName } from '#shared/utils/getLanguageName';

interface LanguageSelectorProps {
  selectedLang: string;
  setSelectedLang: Dispatch<React.SetStateAction<string>>;
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
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedLang}
      </Button>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        {base_languages.map((language) => (
          <MenuItem
            key={language}
            value={language}
            onClick={() => {
              setSelectedLang(language);
              handleClose();
            }}
          >
            {getLanguageName(language, i18n.language)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
