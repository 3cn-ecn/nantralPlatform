import { useTranslation } from 'react-i18next';
import axios from 'axios';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { SvgIcon, Typography, Grid, Avatar, Button, Box } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { MembershipsStudent } from '../../components/Group/MembershipsStudent/';
import { EditProfilModal } from '../../components/FormProfil/FormProfil';

const API_URL = '../../api/student/student/';

function Profile() {
  const [student, setStudent] = React.useState(null);
  const { studentId } = useParams();
  const url = API_URL + studentId;

  const { t } = useTranslation('translation');

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

  async function createProfile(suggestion: Suggestion) {
    return console.log('test');
  }

  const fac = {
    Gen: t('profile.gene'),
    Mas: t('profile.master'),
    Iti: t('profile.iti'),
    Doc: t('profile.doc'),
  };

  const [openS, setOpenS] = React.useState(false);

  const handleClickOpen = () => {
    setOpenS(true);
  };

  const handleCloseS = () => {
    setOpenS(false);
  };
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
              {student === null ? 'Chargement en cours' : fac[student.faculty]}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="h7">
              {t('profile.promo')}
              {student !== null ? student.promo : ''}
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
              onClick={handleClickOpen}
            >
              {t('profile.edit')}
              <SvgIcon
                sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }}
                fontSize="small"
                component={ModeEditIcon}
                inheritViewBox
              />
            </Button>
            <EditProfilModal
              open={openS}
              closeModal={handleCloseS}
              saveProfile={createProfile}
            />
          </Grid>
        </Grid>
      </Grid>
      <MembershipsStudent Id={studentId} />
    </Box>
  );
}

export default Profile;
