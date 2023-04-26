import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams } from 'react-router-dom';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, Skeleton, SvgIcon, Typography } from '@mui/material';
import axios from 'axios';

import Avatar from '#components/Avatar/Avatar';
import { EditProfilModal } from '#components/FormProfil/FormProfil';
import { MembershipsStudent } from '#components/Group/MembershipsStudent';
import { LoadStatus } from '#types/GenericTypes';

const API_URL = '/api/student/student/';

export default function ProfilePage() {
  const [student, setStudent] = React.useState(null);
  const { studentId } = useParams();
  const url = API_URL + studentId;

  const { t } = useTranslation('translation');

  const [profileStatus, setProfileStatus] =
    React.useState<LoadStatus>('loading');
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
        setProfileStatus('success');
      })
      .catch((err) => {
        console.error(err);
        setProfileStatus('error');
      });
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
    <Box sx={{ mt: 5, ml: 5, mr: 5 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={5} lg={2.3} xl={2.3}>
          {profileStatus === 'loading' ? (
            <Skeleton variant="circular" height={250} />
          ) : (
            <Avatar
              url={student?.picture}
              title={student.name}
              size="extra_large"
            />
          )}
        </Grid>
        <Grid item xs={12} lg={9} sx={{ mt: 2, ml: 5 }}>
          <Grid>
            {profileStatus === 'loading' ? (
              <Skeleton width={600} />
            ) : (
              <Typography variant="h4">{student?.name}</Typography>
            )}
          </Grid>
          <Grid>
            {profileStatus === 'loading' ? (
              <Skeleton width={300} />
            ) : (
              <Typography variant="h6">{fac[student.faculty]}</Typography>
            )}
          </Grid>
          <Grid>
            {profileStatus === 'loading' ? (
              <Skeleton width={300} />
            ) : (
              <Typography variant="h6">
                {t('profile.promo')}
                {student.promo}
              </Typography>
            )}
          </Grid>
          <Grid>
            {profileStatus !== 'loading' && idMe === student.id && (
              <LoadingButton
                variant="contained"
                component={NavLink}
                reloadDocument
                to={`/student/${studentId}/edit/`}
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
              saveProfile={() => null} // TODO
            />
          </Grid>
        </Grid>
      </Grid>
      <MembershipsStudent Id={studentId} />
    </Box>
  );
}
