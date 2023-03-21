import i18n from 'i18next';
import { ChevronRight } from '@mui/icons-material';
import { Button } from '@mui/material';
import * as React from 'react';

export function PageSuggestionButton(props: {
  text: { fr: string; en: string };
  link?: string;
  action?: () => void;
}) {
  const { text, link, action } = props;
  const language = i18n.languages[0];
  return (
    <Button
      variant="contained"
      disableTouchRipple
      endIcon={link && <ChevronRight />}
      sx={{
        display: 'flex',
        marginBottom: '20px',
        width: '100%',
        justifyContent: 'space-between',
      }}
      onClick={action}
    >
      {language === 'en-GB' && text.en ? text.en : text.fr}
    </Button>
  );
}
PageSuggestionButton.defaultProps = {
  link: null,
  action: null,
};
