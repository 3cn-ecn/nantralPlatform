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
import PersonIcon from '@mui/icons-material/Person';
import SimpleAccordion from '../Accordion/SimpleAccordion';
import CheckboxesTags from '../Checkbox/CheckboxesTags/CheckboxesTags';
import CheckboxButton from '../Checkbox/CheckboxButton/CheckboxButton';
import BasicDatePicker from '../DatePicker/BasicDatePicker';

interface FilterInterface {
  id: string;
  name: string;
  icon: any;
  isMenu?: boolean;
  content: any;
}

interface ResultInterface {
  id: string;
  value: any;
}

function FilterBar() {
  const [state, setState] = React.useState({
    right: false,
  });
  const [dateBegin, setDateBegin] = React.useState(null);
  const [dateBeginTransformed, setDateBeginTransformed] = React.useState(null);
  const [dateEnd, setDateEnd] = React.useState(null);
  const [dateEndTransformed, setDateEndTransformed] = React.useState(null);
  const [isFavorite, setIsFavorite] = React.useState(null);
  const [isParticipated, setIsParticipated] = React.useState(null);
  const [isShotgun, setIsShotgun] = React.useState(null);
  const [organiser, setOrganiser] = React.useState(null);
  const [validateFilter, setValidateFilter] = React.useState(null);

  const getDateBegin = (newDate) => {
    setDateBegin(newDate);
    if (newDate !== null) {
      setDateBeginTransformed(newDate.format('DD/MM/YYYY'));
    }
  };
  const getDateEnd = (newDate) => {
    setDateEnd(newDate);
    if (newDate !== null) {
      setDateEndTransformed(newDate.format('DD/MM/YYYY'));
    }
  };
  const getChecked = (id, checked) => {
    if (id === 'favoris') {
      setIsFavorite(checked);
    }
    if (id === 'participe') {
      setIsParticipated(checked);
    }
    if (id === 'shotgun') {
      setIsShotgun(checked);
    }
  };
  const getOrganiser = (organiserDic) => {
    setOrganiser(organiserDic);
  };

  const filters: FilterInterface[] = [
    {
      id: 'date',
      name: 'Date',
      icon: <DateRangeIcon />,
      isMenu: true,
      content: (
        <>
          <Grid item xs="auto">
            <p>Du :</p>
            <BasicDatePicker
              label={null}
              minDate={null}
              getDate={getDateBegin}
            />
          </Grid>
          <Grid item xs="auto">
            <p>Au :</p>
            <BasicDatePicker
              label={null}
              minDate={dateBegin}
              getDate={getDateEnd}
            />
          </Grid>
        </>
      ),
    },
    {
      id: 'favorite',
      name: 'Favoris',
      icon: <FavoriteIcon />,
      isMenu: false,
      content: null,
    },
    {
      id: 'participate',
      name: 'Je participe',
      icon: <PersonIcon />,
      isMenu: false,
      content: null,
    },
    {
      id: 'organiser',
      name: 'Organisateur',
      icon: <GroupsIcon />,
      isMenu: true,
      content: <CheckboxesTags label="Organisateur" getResult={getOrganiser} />,
    },
    {
      id: 'shotgun',
      name: 'Shotgun',
      icon: <TimerIcon />,
      isMenu: false,
      content: null,
    },
  ];

  const currentFilter: ResultInterface[] = [
    { id: 'dateBegin', value: { dateBeginTransformed } },
    { id: 'dateEnd', value: { dateEndTransformed } },
    { id: 'favorite', value: { isFavorite } },
    { id: 'participate', value: { isParticipated } },
    { id: 'organiser', value: { organiser } },
    { id: 'shotgun', value: { isShotgun }},
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
    <Box className="center" role="presentation">
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <IconButton onClick={toggleDrawer(anchor, false)}>
          <Close />
        </IconButton>
      </div>
      <h2>Filtres</h2>

      <List>
        {filters.map((filter) => (
          <ListItem component="div" key={filter.id} disablePadding>
            <ListItem className="auto-fit">
              {filter.isMenu ? (
                <SimpleAccordion
                  label={filter.name}
                  content={filter.content}
                  icon={filter.icon}
                />
              ) : (
                <CheckboxButton
                  label={filter.name}
                  icon={filter.icon}
                  id={filter.id}
                  getChecked={getChecked}
                />
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
