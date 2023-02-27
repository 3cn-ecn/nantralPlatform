import * as React from 'react';
import { ChevronRightOutlined, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

export function AccordionSection(props: {
  title: string;
  url: string;
  content: JSX.Element | Array<JSX.Element>;
}) {
  const { url, content, title } = props;
  const [expanded, setExpanded] = React.useState<boolean>(true);
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
              ':hover': { textDecoration: 'underline', bgcolor: 'transparent' },
            }}
          >
            <h1 className="section-title">{title}</h1>
            <ChevronRightOutlined />
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
