import { useTranslation } from 'react-i18next';
import axios from 'axios';
import * as React from 'react';
import { LoadStatus } from 'Props/GenericTypes';
import { useParams, NavLink } from 'react-router-dom';
import { SvgIcon, Typography, Grid, Box, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { MembershipsStudent } from '../../components/Group/MembershipsStudent/';
import { EditProfilModal } from '../../components/FormProfil/FormProfil';
import Avatar from '../../components/Avatar/Avatar';

const API_URL = '/api/student/student/';

function Profile() {
  const [student, setStudent] = React.useState(null);
  const { studentId } = useParams();
  const url = API_URL + studentId;

  const { t } = useTranslation('translation');

  const [eventStatus, setEventStatus] = React.useState<LoadStatus>('load');
  const [idMe, setIdMe] = React.useState<number>(2);

  React.useEffect(() => {
    getMe();
    getProfile();
  }, []);

  async function getMe() {
    axios
      .get('/api/student/student/me/')
      .then((res) => {
        setIdMe(res.data.id);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async function getProfile() {
    axios
      .get(url)
      .then((res) => {
        setStudent(res.data);
        setEventStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setEventStatus('fail');
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

  const handleCloseS = () => {
    setOpenS(false);
  };
  return (
    <Box container sx={{ mt: 5, ml: 5, mr: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5} lg={2.3} xl={2.3}>
          {eventStatus === 'load' ? (
            <Skeleton variant="circular" height={250} />
          ) : (
            <Avatar
              url={student.picture}
              title={student.name}
              size="extra_large"
            />
          )}
        </Grid>
        <Grid item xs={12} lg={9} sx={{ mt: 2, ml: 5 }}>
          <Grid>
            {eventStatus === 'load' ? (
              <Skeleton width={600} />
            ) : (
              <Typography variant="h4">{student.name}</Typography>
            )}
          </Grid>
          <Grid>
            {eventStatus === 'load' ? (
              <Skeleton width={300} />
            ) : (
              <Typography variant="h7">{fac[student.faculty]}</Typography>
            )}
          </Grid>
          <Grid>
            {eventStatus === 'load' ? (
              <Skeleton width={300} />
            ) : (
              <Typography variant="h7">
                {t('profile.promo')}
                {student.promo}
              </Typography>
            )}
          </Grid>
          <Grid>
            {eventStatus !== 'load' && idMe === student.id && (
              <LoadingButton
                loading={eventStatus === 'load'}
                variant="contained"
                component={NavLink}
                reloadDocument
                to="edit/"
                size="small"
                sx={{ mt: 2 }}
              >
                {t('profile.edit')}
                <SvgIcon
                  sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }}
                  fontSize="small"
                  component={ModeEditIcon}
                  inheritViewBox
                />
              </LoadingButton>
            )}
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
