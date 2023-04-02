import React from 'react';
import Container from '@mui/material/Container';
import axios from 'axios';
import { LoadStatus } from 'Props/GenericTypes';
import { Button, Grid } from '@mui/material';
import {
  ClubAvatar,
  ClubAvatarSkeleton,
} from '../../components/ClubAvatar/ClubAvatar';
/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
function Group() {
  const [groupTypeList, setGroupTypeList] = React.useState([]);
  const [groupTypeStatus, setGroupTypeStatus] =
    React.useState<LoadStatus>('load');

  React.useEffect(() => {
    axios
      .get('/api/group/grouptype/')
      .then((res) => {
        setGroupTypeList(res.data.results);
        setGroupTypeStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setGroupTypeStatus('fail');
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
        {true && (
          <Button
            href="/admin/group/grouptype/changelist/"
            target="_blank"
            variant="text"
            sx={{ height: 'fit-content' }}
          >
            Voir la liste
          </Button>
        )}
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
                <ClubAvatar
                  name={groupType.name}
                  clubUrl={`/group/${groupType.slug}`}
                  logoUrl={groupType.icon}
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
                <ClubAvatarSkeleton />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}

export default Group;
