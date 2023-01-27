import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import AttractionsIcon from '@mui/icons-material/Attractions';
import { Close, Height, PhotoCamera } from '@mui/icons-material';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
} from '@mui/material';

interface filterInterface {
  name: string;
  icon: any;
  isMenu?: boolean;
}

// ATTENTION POUR LES ORGANISATEURS, UTILISER UN CHECKBOXES DE AUTOCOMPLETE

function FilterBar() {
  const [state, setState] = React.useState({
    right: false,
  });
  const filters: filterInterface[] = [
    {
      name: 'Date',
      icon: <DateRangeIcon />,
      isMenu: true,
    },
    {
      name: 'Favoris',
      icon: <FavoriteBorderIcon />,
      isMenu: false,
    },
    {
      name: 'Organisateur',
      icon: <GroupsIcon />,
      isMenu: true,
    },
    {
      name: 'Type',
      icon: <AttractionsIcon />,
      isMenu: true,
    },
  ];

  const toggleDrawer =
    (anchor: 'right', open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: 'right') => (
    <Box role="presentation" onKeyDown={toggleDrawer(anchor, false)}>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <IconButton onClick={toggleDrawer(anchor, false)}>
          <Close />
        </IconButton>
      </div>
      <h2>Filtres</h2>

      <List>
        {filters.map((filter) => (
          <ListItem key={filter.name} disablePadding>
            <ListItem>
              <ListItemIcon>{filter.icon}</ListItemIcon>
              <ListItemText primary={filter.name} />
            </ListItem>
            <Checkbox size="small" />
          </ListItem>
        ))}
        {/* {['Favoris', 'Date', 'Organisateur', 'Type'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItem>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
              <Checkbox size="small" />
            </ListItem>
          </ListItem>
        ))} */}
      </List>
      <div style={{ height: '15px' }}></div>
      <div>
        <Button onClick={toggleDrawer(anchor, false)} variant="contained">
          Valider
        </Button>
      </div>
    </Box>
  );

  return (
    <div>
      {(['right'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ textTransform: 'none', padding: '2px 8px' }}
            variant="contained"
            onClick={toggleDrawer(anchor, true)}
            endIcon={<FilterAltIcon />}
          >
            Filtrer
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              width: 240,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 240,
                boxSizing: 'border-box',
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default FilterBar;
