import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Button, Container } from '@mui/material';

import { FilterInterface } from '#types/Filter';

import FilterBar from '../../components/FilterBar/FilterBar';
import ModalEditEvent from '../../components/FormEvent/FormEvent';
import './Event.page.scss';
import EventView from './views/EventView';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
export default function EventPage() {
  const [queryParameters, setQueryParams] = useSearchParams();
  const [filter, setFilter] = React.useState<FilterInterface | null>({
    dateBegin: queryParameters.get('dateBegin'),
    dateEnd: queryParameters.get('dateEnd'),
    favorite: queryParameters.get('favorite') ? true : null,
    organiser: queryParameters.get('organiser'),
    participate: queryParameters.get('participate') ? true : null,
    shotgun: queryParameters.get('shotgun') ? true : null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  function updateParameters(attributes: object) {
    const pairs = Object.entries(attributes);
    pairs.forEach(([key, value]) => {
      if (value) queryParameters.set(key, value.toString());
      else queryParameters.delete(key);
    });
    setQueryParams(queryParameters);
  }

  const getFilter = (validateFilter: FilterInterface) => {
    setFilter(validateFilter);
    updateParameters(validateFilter);
  };

  return (
    <Container className="EventPage">
      <h1>Évènements</h1>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-begin' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenAddModal(true)}
          >
            Créer un événement
          </Button>
          <ModalEditEvent
            open={openAddModal}
            closeModal={() => setOpenAddModal(false)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FilterBar filter={filter} getFilter={getFilter} />
        </div>
      </Box>
      <EventView
        filter={filter}
        selectedTab={queryParameters.get('tab')}
        onChangeTab={(value) => updateParameters({ tab: value })}
        onChangePage={(page: number) => updateParameters({ page: page })}
      />
    </Container>
  );
}
