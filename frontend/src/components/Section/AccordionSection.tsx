import * as React from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Grid,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import './AccordionSection.scss';

export function AccordionSection(props: {
  title: string;
  url?: string;
  content: JSX.Element | Array<JSX.Element>;
  badge?: number;
  accordion?: boolean;
}) {
  const { url, content, title, badge, accordion } = props;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  if (!accordion) {
    return (
      <Box marginBottom={2}>
        {title && (
          <NavLink to={url} className="see-more">
            <Button
              sx={{
                textAlign: 'left',
                marginBottom: 2,
                lineHeight: 1,
                textTransform: 'none',
                color: 'text.primary',
                ':hover': {
                  textDecoration: 'underline',
                  bgcolor: 'transparent',
                },
              }}
            >
              <h1 className="section-title">{title}</h1>
              {badge > 0 && (
                <Badge
                  badgeContent={badge}
                  color="primary"
                  sx={{ margin: 2.5, zIndex: 0 }}
                />
              )}
            </Button>
          </NavLink>
        )}
        <Grid spacing={2} container className="event-grid" alignItems="stretch">
          {content}
        </Grid>
      </Box>
    );
  }

  return (
    <Accordion
      sx={{ borderRadius: '4px' }}
      variant="outlined"
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      square={false}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <NavLink to={url} className="see-more">
          <Button
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              ':hover': {
                textDecoration: 'underline',
                bgcolor: 'transparent',
              },
            }}
          >
            <h1 className="section-title">{title}</h1>
            {badge > 0 && (
              <Badge
                badgeContent={badge}
                color="primary"
                sx={{ margin: 2.5, zIndex: 0 }}
              />
            )}
          </Button>
        </NavLink>
      </AccordionSummary>
      <AccordionDetails>
        <Grid spacing={2} container className="event-grid" alignItems="stretch">
          {content}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
AccordionSection.defaultProps = {
  badge: 0,
  url: null,
  accordion: false,
};
