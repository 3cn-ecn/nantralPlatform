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
import SimpleAccordion from '../Accordion/SimpleAccordion';
import CheckboxesTags, {
  AutocompleteField,
} from '../Checkbox/CheckboxesTags/CheckboxesTags';
import CheckboxButton from '../Checkbox/CheckboxButton/CheckboxButton';
import BasicDatePicker from '../DatePicker/BasicDatePicker';
import { ClubProps } from '../../Props/Club';
import { FieldType } from '../../../legacy/utils/form';

interface FilterInterface {
  id: string;
  name: string;
  icon: any;
  isMenu?: boolean;
  content: any;
}

function FilterBar(props: { getFilter: any }) {
  const { getFilter } = props;
  const { t } = useTranslation('translation'); // translation module
  const [open, setOpen] = React.useState(false);
  const [dateBegin, setDateBegin] = React.useState<Dayjs | null>(null);
  const [dateEnd, setDateEnd] = React.useState(null);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isParticipated, setIsParticipated] = React.useState(false);
  const [isShotgun, setIsShotgun] = React.useState(false);
  const [organiser, setOrganiser] = React.useState(null);
  const [groups, setGroups] = React.useState<Array<ClubProps>>([]);
  const currentFilter = new Map();

  const getDateBegin = (newDate) => {
    setDateBegin(newDate);
  };
  const getDateEnd = (newDate) => {
    setDateEnd(newDate);
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

  currentFilter.set('dateBegin', dateBegin);
  currentFilter.set('dateEnd', dateEnd);
  currentFilter.set('favorite', isFavorite);
  currentFilter.set('participate', isParticipated);
  currentFilter.set('shotgun', isShotgun);
  currentFilter.set('organiser', organiser);
  console.log(organiser);

  const filters: FilterInterface[] = [
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
            tableContent={groups}
            getResult={getOrganiser}
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
