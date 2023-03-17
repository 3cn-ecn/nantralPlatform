import * as React from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
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
import { Dayjs } from 'dayjs';
import { SimpleGroupProps } from 'Props/Group';
import { FilterFrontInterface, FilterInterface } from 'Props/Filter';
import SimpleAccordion from '../Accordion/SimpleAccordion';
import CheckboxesTags from '../Checkbox/CheckboxesTags/CheckboxesTags';
import CheckboxButton from '../Checkbox/CheckboxButton/CheckboxButton';
import BasicDatePicker from '../DatePicker/BasicDatePicker';
/**
 * Function to display a Filterbar for Event Page. It contains a button and the whole Filter drawer.
 * @param props getFilter is the function used to get filter from parent component
 * @returns the filter bar
 */
function FilterBar(props: { getFilter: any }) {
  const { getFilter } = props;
  const { t } = useTranslation('translation'); // translation module
  const [open, setOpen] = React.useState(false); // set true to open the drawer
  const [dateBegin, setDateBegin] = React.useState<Dayjs | null>(null); // date from which the events are filtered
  const [dateBeginFormat, setDateBeginFormat] = React.useState(''); // date from which the events are filtered, as a string
  const [dateEndFormat, setDateEndFormat] = React.useState(''); // date until which the events are filtered, as a string
  const [isFavorite, setIsFavorite] = React.useState(false); // true if the 'Favorite' filter is checked
  const [isParticipated, setIsParticipated] = React.useState(false); // true if the 'I participate' filter is checked
  const [isShotgun, setIsShotgun] = React.useState(false); // true if the 'Shotgun' filter is checked
  const [organiser, setOrganiser] = React.useState(''); // the list of organiser displayed, as a string (a,b,c...)

  // Functions to get filter values from child components
  const getDateBegin = (newDate) => {
    setDateBegin(newDate);
    if (newDate !== null) {
      setDateBeginFormat(newDate.format('YYYY-MM-DD'));
    } else {
      setDateBeginFormat('');
    }
  };
  const getDateEnd = (newDate) => {
    if (newDate !== null) {
      // we want to include events from endDate
      setDateEndFormat(newDate.format('YYYY-MM-DD').concat(' ', '23:59:59'));
    } else {
      setDateEndFormat('');
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
  const getOrganiser = (organiserList: Array<SimpleGroupProps>) => {
    setOrganiser(organiserList.map((elem) => elem.slug).join(','));
  };

  // value of the current filter
  const currentFilter: FilterInterface = {
    dateBegin: dateBeginFormat,
    dateEnd: dateEndFormat,
    favorite: isFavorite,
    participate: isParticipated,
    shotgun: isShotgun,
    organiser: organiser,
  };

  // filter interface with every filter to display
  const filters: FilterFrontInterface[] = [
    {
      id: 'favorite',
      name: t('filterbar.favorite'),
      icon: <FavoriteIcon />,
      isMenu: false,
      content: null,
    },
    {
      id: 'participate',
      name: t('filterbar.participating'),
      icon: <PersonIcon />,
      isMenu: false,
      content: null,
    },
    {
      id: 'shotgun',
      name: t('filterbar.shotgun'),
      icon: <TimerIcon />,
      isMenu: false,
      content: null,
    },
    {
      id: 'organiser',
      name: t('filterbar.organiser'),
      icon: <GroupsIcon />,
      isMenu: true,
      content: (
        <Grid item xs="auto">
          <CheckboxesTags
            label={t('filterbar.organiser')}
            getResult={getOrganiser}
            updated
            request="/api/group/group/"
            pkField="slug"
            labelField="name"
            optionsList={null}
          />
        </Grid>
      ),
    },
    {
      id: 'date',
      name: t('filterbar.date'),
      icon: <DateRangeIcon />,
      isMenu: true,
      content: (
        <>
          <Grid item xs="auto">
            <BasicDatePicker
              label={t('filterbar.from')}
              minDate={null}
              getDate={getDateBegin}
            />
          </Grid>
          <div style={{ height: '15px' }}></div>
          <Grid item xs="auto">
            <BasicDatePicker
              label={t('filterbar.to')}
              minDate={dateBegin}
              getDate={getDateEnd}
            />
          </Grid>
        </>
      ),
    },
  ];

  // function used to validate a filter, sending it to parent component
  const validate = () => {
    setOpen(false);
    getFilter(currentFilter);
  };

  // content of the drawer to display
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
      <h2>{t('filterbar.title_filter')}</h2>

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
          {t('filterbar.validate_button')}
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
            {t('filterbar.title_filter')}
          </Button>
          <Drawer
            keepMounted // the drawer is not reload when closed then opened
            anchor={anchor} // the side of the screen where the drawer opens (here right)
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
