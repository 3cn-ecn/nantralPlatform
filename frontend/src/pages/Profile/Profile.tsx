import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import * as React from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { SvgIcon, Typography, Grid, Avatar, Button, Box } from '@mui/material';
import { ClubSection } from '../../components/Section/ClubSection/ClubSection';
import { EventProps, eventsToCamelCase } from '../../Props/Event';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import { EventSection } from '../../components/Section/EventSection/EventSection';
import { isThisWeek } from '../../utils/date';
import { PostSection } from '../../components/Section/PostSection/PostSection';
import { PostProps } from '../../Props/Post';
import { Status } from '../../Props/GenericTypes';
import { MembershipsStudent } from '../../legacy/group/MembershipsStudent/';

const API_URL = '../../api/student/student/';

function Profile() {
  const [student, setStudent] = React.useState<Student | null>(null);
  const { studentId } = useParams();
  const url = API_URL + studentId;
  React.useEffect(() => {
    axios
      .get<Student>(url)
      .then((res) => setStudent(res.data))
      .catch((err) => {
        console.error(err);
      });
  }, []);
  return (
    <Box container sx={{ mt: 5, ml: 5, mr: 5 }}>
      <Grid container spacing={2}>
        <Grid xs={2.3}>
          <Grid xs={4}>
            <Avatar sx={{ width: 250, height: 250 }} />
          </Grid>
        </Grid>
        <Grid xs={4}>
          <Grid sx={{ mt: 2 }}>
            <Typography variant="h4">{student.name}</Typography>
          </Grid>
          <Grid>
            <Typography variant="h7">Catégorie </Typography>
          </Grid>
          <Grid>
            <Typography variant="h7">Année entrée à Centrale: 2001 </Typography>
          </Grid>
          <Grid>
            <Button variant="outlined"> Modifier mon profil </Button>
          </Grid>
        </Grid>
      </Grid>
      <MembershipsStudent Id={studentId} />
    </Box>
  );
}

export default Profile;
