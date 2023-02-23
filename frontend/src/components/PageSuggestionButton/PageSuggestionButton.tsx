import i18n from 'i18next';
import { ChevronRight } from '@mui/icons-material';
import { Button, Link as LinkMui } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';

export function PageSuggestionButton(props: {
  text: { fr: string; en: string };
  link?: string;
}) {
  const { text, link } = props;
  const language = i18n.languages[0];
  return (
    <LinkMui component={Link} to={link} color="textPrimary" underline="none">
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
      >
        {language === 'en-GB' && text.en ? text.en : text.fr}
      </Button>
    </LinkMui>
  );
}
PageSuggestionButton.defaultProps = {
  link: null,
};
