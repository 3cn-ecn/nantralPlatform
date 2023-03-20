import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListItemIcon } from '@mui/material';
import './SimpleAccordion.scss';

/**
 * Function to display a simple accordion
 * @param props label : title on the accordion, icon : icon next to label,
 *              content : what is displayed inside the accordion
 * @returns an accordion
 */
function SimpleAccordion(props: { label: string; icon: any; content: any }) {
  const { label, icon, content } = props;

  return (
    // <div>
    <Accordion square className="accordion">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <Typography component="span">{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography component="span">{content}</Typography>
      </AccordionDetails>
    </Accordion>
    // </div>
  );
}

export default SimpleAccordion;
