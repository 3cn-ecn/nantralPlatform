import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ClubProps } from 'Props/Club';
import * as React from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { SvgIcon, Typography, Grid, Avatar, Button, Box } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
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
  const [student, setStudent] = React.useState(null);
  const [faculty, setFaculty] = React.useState<string>('/');
  const { studentId } = useParams();
  const url = API_URL + studentId;

  React.useEffect(() => {
    getProfile();
    console.log(student);
  }, []);

  async function getProfile() {
    axios
      .get(url)
      .then((res) => setStudent(res.data))
      .catch((err) => {
        console.error(err);
      });
  }

  function getFaculty(fac) {
    switch (fac) {
      case 'Gen':
        setFaculty('Élève Ingénieur Généraliste');
        break;
      case 'Mas':
        setFaculty('Élève en Master');
        break;
      case 'Iti':
        setFaculty('Élève Ingénieur de Spécialité (ITII)');
        break;
      case 'Doc':
        setFaculty('Doctorant');
        break;
      default:
        setFaculty('');
        break;
    }
  }
  return (
    <Box container sx={{ mt: 5, ml: 5, mr: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5} lg={2.3} xl={2.3}>
          <Avatar
            sx={{ width: 250, height: 250 }}
            src={student !== null ? student.picture : ''}
          />
        </Grid>
        <Grid item xs={12} lg={9} sx={{ mt: 2, ml: 5 }}>
          <Grid>
            <Typography variant="h4">
              {student !== null ? student.name : ''}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="h7">
              {student === null || faculty !== '/'
                ? faculty
                : getFaculty(student.faculty)}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="h7">
              Année entrée à Centrale: {student !== null ? student.promo : ''}
            </Typography>
          </Grid>
          <Grid>
            <Button variant="contained" size="small">
              Modifier mon profil
              <SvgIcon
                sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }}
                fontSize="small"
                component={ModeEditIcon}
                inheritViewBox
              />
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <MembershipsStudent Id={studentId} />
    </Box>
  );
}

export default Profile;
