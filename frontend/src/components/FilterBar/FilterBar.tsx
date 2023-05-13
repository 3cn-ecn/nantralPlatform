import React from 'react';

// eslint-disable-next-line import/order
import { Close } from '@mui/icons-material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TimerIcon from '@mui/icons-material/Timer';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import axios from 'axios';
import dayjs from 'dayjs';

import { useTranslation } from '#i18n/useTranslation';
import { FilterFrontInterface, FilterInterface } from '#types/Filter';
import { SimpleGroupProps } from '#types/Group';

import SimpleAccordion from '../Accordion/SimpleAccordion';
import CheckboxButton from '../Checkbox/CheckboxButton/CheckboxButton';
import CheckboxesTags from '../Checkbox/CheckboxesTags/CheckboxesTags';
import BasicDatePicker from '../DatePicker/BasicDatePicker';
import './FilterBar.scss';

/**
 * Function to display a Filterbar for Event Page. It contains a button and the whole Filter drawer.
 * @param props getFilter is the function used to get filter from parent component
 * @returns the filter bar
 */
function FilterBar(props: {
  onChangeFilter: (newFilter: FilterInterface) => void;
  filter: FilterInterface;
}) {
  const { onChangeFilter: getFilter, filter } = props;
  const { t } = useTranslation(); // translation module
  const [open, setOpen] = React.useState(false); // set true to open the drawer

  const [currentFilter, setCurrentFilter] =
    React.useState<FilterInterface>(filter);

  // Update current filter if changed outside of the component
  React.useEffect(() => {
    setCurrentFilter(filter);
  }, [filter]);
  // filter interface with every filter to display
  const filters: FilterFrontInterface[] = [
    {
      id: 'favorite',
      name: t('filterbar.favorite'),
      icon: <FavoriteIcon />,
      isMenu: false,
      content: null,
      value: currentFilter.favorite,
      onChangeValue: (value) =>
        setCurrentFilter({ ...currentFilter, favorite: value }),
    },
    {
      id: 'participate',
      name: t('filterbar.participating'),
      icon: <PersonIcon />,
      isMenu: false,
      content: null,
      value: currentFilter.participate,
      onChangeValue: (value) =>
        setCurrentFilter({ ...currentFilter, participate: value }),
    },
    {
      id: 'shotgun',
      name: t('filterbar.shotgun'),
      icon: <TimerIcon />,
      isMenu: false,
      content: null,
      value: currentFilter.shotgun,
      onChangeValue: (value) =>
        setCurrentFilter({ ...currentFilter, shotgun: value }),
    },
    {
      id: 'organiser',
      name: t('filterbar.organiser'),
      icon: <GroupsIcon />,
      isMenu: true,
      value: filter.organiser,
      content: (
        <Grid item xs="auto">
          <CheckboxesTags
            label={t('filterbar.organiser')}
            getResult={(results) => {
              setCurrentFilter({ ...currentFilter, organiser: results });
            }}
            updated
            value={currentFilter.organiser}
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
              onChange={(value) =>
                setCurrentFilter({
                  ...currentFilter,
                  dateBegin: value ? value.toDate() : undefined,
                })
              }
              value={dayjs(currentFilter.dateBegin)}
            />
          </Grid>
          <div style={{ height: '15px' }}></div>
          <Grid item xs="auto">
            <BasicDatePicker
              label={t('filterbar.to')}
              minDate={currentFilter.dateBegin}
              onChange={(value) =>
                setCurrentFilter({
                  ...currentFilter,
                  dateEnd: value ? value.toDate() : undefined,
                })
              }
              value={dayjs(currentFilter.dateEnd)}
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
        {filters.map((filterItem) => (
          <ListItem component="div" key={filterItem.id} disablePadding>
            <ListItem className="auto-fit">
              {filterItem.isMenu ? (
                <SimpleAccordion
                  label={filterItem.name}
                  content={filterItem.content}
                  icon={filterItem.icon}
                />
              ) : (
                <CheckboxButton
                  value={filterItem.value}
                  label={filterItem.name}
                  icon={filterItem.icon}
                  id={filterItem.id}
                  onChangeValue={filterItem.onChangeValue}
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
