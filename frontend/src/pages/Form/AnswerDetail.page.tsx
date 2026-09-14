import { Trans } from 'react-i18next';
import { Link, useParams } from 'react-router';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  Link as MuiLink,
} from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

import { getAnswerDetailsApi } from '#modules/form/api/getAnswerDetails.api';
import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { ShowForm } from '#modules/form/view/shared/ShowForm';
import { useUserDetails } from '#pages/StudentDetails/hooks/useUserDetails';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function AnswerDetailPage() {
  const { t } = useTranslation();
  const { uuid, answerId } = useParams();
  const { data: formSchema } = useSuspenseQuery({
    queryKey: ['form', uuid],
    queryFn: () => {
      if (uuid) return getJsonSchemaApi(uuid);
      throw 'Invalid Id';
    },
  });

  const { data } = useSuspenseQuery({
    queryKey: ['answer', answerId],
    queryFn: () => {
      if (uuid && answerId)
        return getAnswerDetailsApi(uuid as UUID, answerId as UUID);
      throw 'Invalid Id';
    },
  });

  const userQuery = useUserDetails(data.user);

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={2}
        mb={3}
      >
        <Tooltip title={t('button.back')}>
          <IconButton component={Link} to={`/form/${uuid}/answers/`}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant={'h2'}>
          {userQuery.isSuccess ? (
            <Trans
              t={t}
              i18nKey={'jsonForm.answers.detailTitle'}
              values={{ user: userQuery.data.name }}
              components={[
                <MuiLink
                  component={Link}
                  to={userQuery.data.url}
                  key={userQuery.data.id}
                />,
              ]}
            />
          ) : (
            t('loading')
          )}
        </Typography>
      </Stack>
      <ShowForm disabled jsonFormSchema={formSchema} initialData={data} />
    </Container>
  );
}
