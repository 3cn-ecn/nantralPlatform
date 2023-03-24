import * as React from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
} from '@mui/material';
import './AccordionSection.scss';

export function AccordionSection(props: {
  title: string;
  content: JSX.Element | Array<JSX.Element>;
  accordion?: boolean;
}) {
  const { content, title, accordion } = props;
  const [expanded, setExpanded] = React.useState<boolean>(true);
  if (!accordion) {
    return (
      <Box marginBottom={2}>
        {title && (
          <h1 className="section-title" style={{ marginBottom: '0.5em' }}>
            {title}
          </h1>
        )}
        <Grid spacing={2} container alignItems="stretch">
          {content}
        </Grid>
      </Box>
    );
  }

  return (
    <Accordion
      variant="outlined"
      expanded={expanded}
      sx={{ borderRadius: 1 }}
      onChange={() => setExpanded(!expanded)}
      square={false}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            columnGap: 1,
          }}
        >
          <h1 className="section-title">{title}</h1>
        </Box>
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
  accordion: false,
};
