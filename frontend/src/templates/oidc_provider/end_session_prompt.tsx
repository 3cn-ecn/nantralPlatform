import { Trans } from 'react-i18next';

import { Button, Link, Tooltip, Typography, useTheme } from '@mui/material';

import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CardTemplate } from '../CardTemplate';
import { wrapAndRenderTemplates } from '../wrapAndRenderTemplates';

declare const client:
  | {
      name: string;
      client_type: string;
      client_id: string;
      terms_url?: string;
      contact_email?: string;
      website_url?: string;
      logo?: string;
    }
  | undefined;
declare const user_name: string;
declare const post_url: string;
declare const csrf_token: string;

function EndSessionPrompt() {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <CardTemplate>
      <form action={post_url} method="POST">
        <div dangerouslySetInnerHTML={{ __html: csrf_token }}></div>
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
          }}
          textAlign="center"
        >
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
          {client && (
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
          )}
        </FlexRow>
        <Spacer vertical={2} />
        <Typography variant={'h4'} textAlign={'center'}>
          <Trans
            i18nKey={'templates.oidc.endSessionPrompt.title'}
            values={{ user_name: user_name }}
            /* eslint-disable-next-line react/jsx-key */
            components={[<strong />]}
          />
          {client && (
            <Trans
              i18nKey={'templates.oidc.endSessionPrompt.titleAppName'}
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
          )}
          ?
        </Typography>
        <Spacer vertical={2} />
        <FlexRow gap={2}>
          <Button type={'submit'} variant={'outlined'}>
            {t('button.cancel')}
          </Button>
          <Button
            name={'allow'}
            type={'submit'}
            value="Yes"
            variant={'contained'}
          >
            {t('button.yes')}
          </Button>
        </FlexRow>
      </form>
    </CardTemplate>
  );
}

wrapAndRenderTemplates(<EndSessionPrompt />, 'root');
