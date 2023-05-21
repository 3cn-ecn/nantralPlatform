import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Button, Container } from '@mui/material';

import { getGroup } from '#api/group';
import { FilterInterface } from '#types/Filter';

import FilterBar from '../../shared/components/FilterBar/FilterBar';
import ModalEditEvent from '../../shared/components/FormEvent/FormEvent';
import './Event.page.scss';
import EventView from './views/EventView';

/**
 * Event Page, with Welcome message, next events, etc...
 * @returns Event page component
 */
export default function Event() {
  const [queryParameters, setQueryParams] = useSearchParams();
  const [filter, setFilter] = React.useState<FilterInterface | null>({
    dateBegin: queryParameters.get('dateBegin')
      ? new Date(queryParameters.get('dateBegin'))
      : undefined,
    dateEnd: queryParameters.get('dateEnd')
      ? new Date(queryParameters.get('dateEnd'))
      : undefined,
    favorite: queryParameters.get('favorite') ? true : null,
    organiser: [],
    participate: queryParameters.get('participate') ? true : null,
    shotgun: queryParameters.get('shotgun') ? true : null,
  });
  const [openAddModal, setOpenAddModal] = useState(false);

  // Get organisers
  React.useEffect(() => {
    const organisers = queryParameters.get('organiser');
    if (organisers)
      Promise.all(
        organisers?.split(',')?.map((slug) => getGroup(slug, { simple: true }))
      ).then((groups) => setFilter({ ...filter, organiser: groups }));
  }, []);

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
    updateParameters({
      ...validateFilter,
      organiser: validateFilter?.organiser
        ?.map((group) => group.slug)
        .join(','),
    });
  };

  return (
    <>
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
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FilterBar filter={filter} onChangeFilter={getFilter} />
          </div>
        </Box>
        <EventView
          onChangeFilter={(changes) => {
            getFilter(changes);
          }}
          filter={filter}
          initialPage={Number.parseInt(queryParameters.get('page'), 10) || 1}
          selectedTab={queryParameters.get('tab')}
          onChangeTab={(value) => updateParameters({ tab: value })}
          onChangePage={(page: number) => updateParameters({ page: page })}
        />
      </Container>
      <ModalEditEvent
        open={openAddModal}
        closeModal={() => setOpenAddModal(false)}
      />
    </>
  );
}
