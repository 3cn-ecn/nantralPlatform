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

function FilterBar(props: { getFilter: any }) {
  const { getFilter } = props;
  const [open, setOpen] = React.useState(false);
  const [dateBegin, setDateBegin] = React.useState(null);
  const [dateBeginTransformed, setDateBeginTransformed] = React.useState(null);
  const [dateEndTransformed, setDateEndTransformed] = React.useState(null);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isParticipated, setIsParticipated] = React.useState(false);
  const [isShotgun, setIsShotgun] = React.useState(false);
  const [organiser, setOrganiser] = React.useState(null);

  const getDateBegin = (newDate) => {
    setDateBegin(newDate);
    if (newDate !== null) {
      setDateBeginTransformed(newDate.format('DD/MM/YYYY'));
    }
  };
  const getDateEnd = (newDate) => {
    if (newDate !== null) {
      setDateEndTransformed(newDate.format('DD/MM/YYYY'));
    }
  };
  const getChecked = (id, checked) => {
    if (id === 'favorite') {
      setIsFavorite(checked);
    }
    if (id === 'participate') {
      setIsParticipated(checked);
    }
    if (id === 'shotgun') {
      setIsShotgun(checked);
    }
  };
  const getOrganiser = (organiserDic) => {
    setOrganiser(organiserDic);
  };
  const currentFilter: ResultInterface[] = [
    { id: 'dateBegin', value: { dateBeginTransformed } },
    { id: 'dateEnd', value: { dateEndTransformed } },
    { id: 'favorite', value: { isFavorite } },
    { id: 'participate', value: { isParticipated } },
    { id: 'organiser', value: { organiser } },
    { id: 'shotgun', value: { isShotgun } },
  ];

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

  const validate = () => {
    setOpen(false);
    getFilter(currentFilter);
  };

  const list = () => (
    <Box className="center" role="presentation">
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <IconButton
          onClick={() => {
            setOpen(false);
          }}
        >
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
        <Button onClick={validate} variant="contained">
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
            onClick={() => {
              setOpen(true);
            }}
            endIcon={<FilterAltIcon />}
          >
            Filtrer
          </Button>
          <Drawer
            keepMounted
            anchor={anchor}
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            sx={{
              width: 300,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 300,
                boxSizing: 'border-box',
              },
            }}
          >
            {list()}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default FilterBar;
