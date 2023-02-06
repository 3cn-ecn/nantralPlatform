import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
import Close from '@mui/icons-material/Close';
import './FilterBar.scss';
import IconButton from '@mui/material/IconButton';
import { Grid } from '@mui/material';
import SimpleAccordion from '../Accordion/SimpleAccordion';
import CheckboxesTags from '../Checkbox/CheckboxesTags/CheckboxesTags';
import CheckboxButton from '../Checkbox/CheckboxButton/CheckboxButton';
import BasicDatePicker from '../DatePicker/BasicDatePicker';

interface FilterInterface {
  name: string;
  icon: any;
  isMenu?: boolean;
  content: any;
}

function FilterBar() {
  const [state, setState] = React.useState({
    right: false,
  });
  const filters: FilterInterface[] = [
    {
      name: 'Date',
      icon: <DateRangeIcon />,
      isMenu: true,
      content: (
        <>
          <Grid item xs="auto">
            <p>Du :</p>
            <BasicDatePicker label={null} />
          </Grid>
          <Grid item xs="auto">
            <p>Au :</p>
            <BasicDatePicker label={null} />
          </Grid>
        </>
      ),
    },
    {
      name: 'Favoris',
      icon: <FavoriteIcon />,
      isMenu: false,
      content: null,
    },
    {
      name: 'Organisateur',
      icon: <GroupsIcon />,
      isMenu: true,
      content: <CheckboxesTags label="Organisateur" />,
    },
    {
      name: 'Shotgun',
      icon: <TimerIcon />,
      isMenu: false,
      content: null,
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
    <Box id="center" role="presentation">
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <IconButton onClick={toggleDrawer(anchor, false)}>
          <Close />
        </IconButton>
      </div>
      <h2>Filtres</h2>

      <List>
        {filters.map((filter) => (
          <ListItem component="div" key={filter.name} disablePadding>
            <ListItem id="auto-fit">
              {filter.isMenu ? (
                <SimpleAccordion
                  label={filter.name}
                  content={filter.content}
                  icon={filter.icon}
                />
              ) : (
                <CheckboxButton label={filter.name} icon={filter.icon} />
              )}
            </ListItem>
          </ListItem>
        ))}
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
            keepMounted
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              width: 300,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 300,
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
