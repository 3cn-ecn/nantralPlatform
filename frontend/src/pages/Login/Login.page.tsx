import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Icon,
  Typography,
  useTheme,
} from '@mui/material';

import { loginApi } from '#modules/account/api/login.api';
import { LoginFormFields } from '#modules/account/view/shared/LoginFormFields';
import '#pages/Login/LoginPage.scss';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';

import { BigButton } from '../../shared/components/Button/BigButton';
import { SeeGroupsButton } from './components/SeeGroups';

/**
 * Home Page, with Welcome message, next events, etc...
 * @returns Home page component
 */
export default function LoginPage() {
  // Query Params
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<
    | {
        response: { data: { message?: string } };
      }
    | undefined
  >(undefined);
  const theme = useTheme();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });

  const { login: move } = useAuth();

  function login() {
    setLoading(true);
    loginApi(formValues)
      .then(() => move())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  return (
    <Container
      sx={{
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      maxWidth={'sm'}
    >
      <Card
        sx={{
          padding: 5,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
        variant="outlined"
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            columnGap: 2,
            rowGap: 1,
          }}
        >
          <Icon
            component="img"
            sx={{
              width: 50,
              height: 50,
              border: 'solid',
              borderRadius: '50%',
              borderColor: 'gray',
              borderWidth: 2,
              // marginBottom: 2,
            }}
            src="/static/img/logo/scalable/logo.svg"
            alt="Nantral platform"
          />
          <Box
            className="login-title"
            sx={{
              color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
            }}
          >
            Nantral Platform.
          </Box>
        </Box>
        <Typography marginTop={1} variant="h6">
          The student website for Centrale Nantes!
        </Typography>
        <Spacer vertical={2} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            login();
          }}
        >
          {error?.response?.data?.message && (
            <Alert severity="error">{error?.response?.data?.message}</Alert>
          )}
          <LoginFormFields
            formValues={formValues}
            updateFormValues={(newValues) =>
              setFormValues({ ...formValues, ...newValues })
            }
            error={error}
            isError={!!error}
            prevData={undefined}
          />
          <Box
            sx={{
              justifyContent: 'space-between',
              width: '100%',
              display: 'flex',
              textTransform: 'none',
              margin: 1,
              marginTop: 2,
            }}
          >
            <Button
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              No account?
            </Button>
            <Button
              onClick={() => navigate('/forgot_password')}
              sx={{ textTransform: 'none' }}
            >
              Forgot password?
            </Button>
          </Box>
          <Divider flexItem />
          <Spacer vertical={3} />
          <BigButton
            sx={{
              width: '100%',
              filter: loading ? 'brightness(0.4)' : undefined,
            }}
            disabled={loading}
            type="submit"
          >
            {loading ? <CircularProgress size={25} /> : 'Login'}
          </BigButton>
        </form>
      </Card>
      <Spacer vertical={3} />
      <SeeGroupsButton />
    </Container>
  );
}
