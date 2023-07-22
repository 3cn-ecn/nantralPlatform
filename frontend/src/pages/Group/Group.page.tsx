import React from 'react';
import { Link } from 'react-router-dom';

import { Button, Grid, Skeleton } from '@mui/material';
import Container from '@mui/material/Container';
import axios from 'axios';

import { Avatar } from '#shared/components/Avatar/Avatar';
import { LoadStatus } from '#types/GenericTypes';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export default function GroupPage() {
  const [groupTypeList, setGroupTypeList] = React.useState([]);
  const [groupTypeStatus, setGroupTypeStatus] =
    React.useState<LoadStatus>('loading');

  React.useEffect(() => {
    axios
      .get('/api/group/grouptype/')
      .then((res) => {
        setGroupTypeList(res.data.results);
        setGroupTypeStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setGroupTypeStatus('error');
      });
  }, []);

  return (
    <Container>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Groupes</h1>
        <Button
          href="/admin/group/grouptype/changelist/"
          target="_blank"
          variant="text"
          sx={{ height: 'fit-content' }}
        >
          Voir la liste
        </Button>
      </div>
      <Grid container>
        {groupTypeStatus === 'success'
          ? groupTypeList.map((groupType) => (
              <Grid
                xs={6}
                md={2}
                sm={4}
                item
                key={groupType.slug}
                sx={{ justifyContent: 'center', display: 'flex' }}
              >
                <Avatar
                  alt={groupType.name}
                  to={`/group/${groupType.slug}`}
                  src={groupType.icon}
                  component={Link}
                  reloadDocument
                />
              </Grid>
            ))
          : groupTypeList.map((groupType) => (
              <Grid
                xs={6}
                md={2}
                sm={4}
                item
                key={groupType.slug}
                sx={{ justifyContent: 'center', display: 'flex' }}
              >
                <Skeleton variant="circular" />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}
