import * as React from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
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
  collapsable?: boolean;
}) {
  const { url, content, title, badge, collapsable } = props;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  if (!collapsable) {
    return (
      <>
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
        <Grid spacing={2} container className="event-grid">
          {content}
        </Grid>
      </>
    );
  }

  return (
    <Accordion
      variant="outlined"
      className="card"
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
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
        <Grid spacing={2} container className="event-grid">
          {content}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
AccordionSection.defaultProps = {
  badge: 0,
  url: null,
  collapsable: true,
};
