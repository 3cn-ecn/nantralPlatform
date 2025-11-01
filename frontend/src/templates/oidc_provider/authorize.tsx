import { Trans } from 'react-i18next';

import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from '@mui/icons-material';
import {
  Avatar as MuiAvatar,
  Badge,
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CardTemplate } from '../CardTemplate';
import { wrapAndRenderTemplates } from '../wrapAndRenderTemplates';

declare const client: {
  name: string;
  client_type: string;
  client_id: string;
  terms_url?: string;
  contact_email?: string;
  website_url?: string;
  logo?: string;
};
declare const hidden_inputs: string;
declare const scopes: { scope: string; name: string; description: string }[];
declare const post_url: string;
declare const csrf_token: string;

function Authorize() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <CardTemplate>
      <form action={post_url} method="POST">
        <div dangerouslySetInnerHTML={{ __html: hidden_inputs }}></div>
        <div dangerouslySetInnerHTML={{ __html: csrf_token }}></div>
        <Typography variant="h2" textAlign="center">
          Nantral Platform
        </Typography>
        <Spacer vertical={2} />
        <FlexRow gap={2} alignItems={'center'} justifyContent={'center'}>
          <Avatar
            src="/static/img/logo/scalable/logo.svg"
            alt="Nantral platform"
            size={'xl'}
            sx={{
              borderWidth: '2px',
              borderColor: theme.palette.secondary.main,
              borderStyle: 'solid',
            }}
          />
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Tooltip
                title={t(
                  `templates.oidc.authorize.clientType.${client.client_type}`,
                )}
              >
                <MuiAvatar
                  sx={{
                    bgcolor:
                      client.client_type === 'public'
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                  }}
                >
                  {client.client_type === 'public' ? (
                    <LockOpenIcon />
                  ) : (
                    <LockIcon />
                  )}
                </MuiAvatar>
              </Tooltip>
            }
          >
            <Avatar
              src={client.logo}
              alt={client.name}
              size={'xl'}
              sx={{
                borderWidth: '2px',
                borderColor: theme.palette.secondary.main,
                borderStyle: 'solid',
              }}
            />
          </Badge>
        </FlexRow>
        <Spacer vertical={2} />
        <Typography variant={'h4'} textAlign={'center'}>
          <Trans
            i18nKey={'templates.oidc.authorize.title'}
            values={{ client_name: client.name }}
            components={[
              client.website_url ? (
                <Tooltip title={client.website_url}>
                  <Link href={client.website_url}>{client.name}</Link>
                </Tooltip>
              ) : (
                // no tooltip nor url if it was not provided
                <strong>{client.name}</strong>
              ),
            ]}
          />
        </Typography>
        <Spacer vertical={2} />
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('templates.oidc.scope')}</TableCell>
                <TableCell>{t('templates.oidc.description')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scopes.map((scope) => (
                <TableRow
                  key={scope.scope}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {t(`templates.oidc.scopes.${scope.scope}.name`, scope.name)}
                  </TableCell>
                  <TableCell>
                    {t(
                      `templates.oidc.scopes.${scope.scope}.description`,
                      scope.description,
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {client.terms_url && (
          <>
            <Spacer vertical={2} />
            <Typography variant={'body2'}>
              <Trans
                i18nKey={'templates.oidc.authorize.terms'}
                values={{ client_name: client.name }}
                components={[
                  // eslint-disable-next-line react/jsx-key
                  <Link href={client.terms_url}>Terms and conditions</Link>,
                ]}
              />
            </Typography>
          </>
        )}
        {client.contact_email && (
          <>
            <Spacer vertical={2} />
            <Typography variant={'body2'}>
              <Trans
                i18nKey={'templates.oidc.authorize.contact'}
                values={{
                  client_name: client.name,
                  contact_email: client.contact_email,
                }}
                components={[
                  // eslint-disable-next-line react/jsx-key
                  <Link href={`mailto:${client.contact_email}`}>
                    {client.contact_email}
                  </Link>,
                ]}
              />
            </Typography>
          </>
        )}
        <Spacer vertical={2} />
        <FlexRow gap={2} justifyContent={'center'}>
          <Button type={'submit'} variant={'outlined'}>
            {t('button.cancel')}
          </Button>
          <Button
            name={'allow'}
            type={'submit'}
            value="Authorize"
            variant={'contained'}
          >
            {t('button.allowAccess')}
          </Button>
        </FlexRow>
      </form>
    </CardTemplate>
  );
}

wrapAndRenderTemplates(<Authorize />, 'root');
