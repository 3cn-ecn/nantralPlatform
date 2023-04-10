import * as React from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import ListItem from '@mui/material/ListItem';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import TimerIcon from '@mui/icons-material/Timer';
import Close from '@mui/icons-material/Close';
import './FilterBarAnnuaire.scss';
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
  const [promo, setPromo] = React.useState<number | null>(null); // date from which the events are filtered
  const [faculty, setFaculty] = React.useState(''); // the list of organiser displayed, as a string (a,b,c...)
  const [cursus, setCursus] = React.useState('');

  // Functions to get filter values from child components
  const getDateBegin = (newDate) => {
    setDateBegin(newDate);
    if (newDate !== null) {
      setDateBeginFormat(newDate.format('YYYY'));
    } else {
      setDateBeginFormat('');
    }
  };

  const fac = [
    { label: t('profile.gene'), slug: 'Gen' },
    { label: t('profile.master'), slug: 'Mas' },
    { label: t('profile.iti'), slug: 'Iti' },
    { label: t('profile.doc'), slug: 'Doc' },
  ];

  const path = [
    { label: t('cursus.alternant'), slug: 'Alt' },
    { label: t('cursus.im'), slug: 'I-M' },
    { label: t('cursus.ai'), slug: 'A-I' },
    { label: t('cursus.ia'), slug: 'I-A' },
    { label: t('cursus.io'), slug: 'I-O' },
    { label: t('cursus.oi'), slug: 'O-I' },
    { label: t('cursus.mi'), slug: 'M-I' },
  ];
  const getFaculty = (facultyList: Array<SimpleGroupProps>) => {
    setFaculty(facultyList.map((elem) => elem.slug).join(','));
  };
  const getCursus = (cursusList: Array<SimpleGroupProps>) => {
    setCursus(cursusList.map((elem) => elem.slug).join(','));
  };

  // value of the current filter
  const currentFilter: FilterInterface = {
    promo: promo,
    filiere: faculty,
    cursus: cursus,
  };

  // filter interface with every filter to display
  const filters: FilterFrontInterface[] = [
    {
      id: 'filiere',
      name: t('annuaire.faculty'),
      icon: <FavoriteIcon />,
      isMenu: true,
      content: (
        <Grid item xs="auto">
          <CheckboxesTags
            label={t('annuaire.faculty')}
            getResult={getFaculty}
            request={null}
            pkField="slug"
            labelField="label"
            optionsList={fac}
          />
        </Grid>
      ),
    },
    {
      id: 'cursus',
      name: t('annuaire.curriculum'),
      icon: <FavoriteIcon />,
      isMenu: true,
      content: (
        <Grid item xs="auto">
          <CheckboxesTags
            label={t('annuaire.curriculum')}
            getResult={getCursus}
            request={null}
            pkField="slug"
            labelField="label"
            optionsList={path}
          />
        </Grid>
      ),
    },
    {
      id: 'promo',
      name: t('annuaire.promo'),
      icon: <DateRangeIcon />,
      isMenu: true,
      content: (
        <Grid item xs="auto">
          <TextField
            label={t('annuaire.promo')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPromo(event.target.value);
            }}
          />
        </Grid>
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
            style={{ padding: '2px 8px' }}
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
