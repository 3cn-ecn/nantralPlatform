import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListItemIcon } from '@mui/material';

function SimpleAccordion(props: { label: string; icon: any; content: any }) {
  const { label, icon, content } = props;

  return (
    <div>
      <Accordion square>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{content}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

export default SimpleAccordion;
