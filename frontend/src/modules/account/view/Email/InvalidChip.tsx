import { Check, Close, ErrorOutline } from '@mui/icons-material';
import { Chip, CircularProgress, Tooltip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { resendVerificationEmailApi } from '#modules/account/api/resendVerificationEmail.api';
import { Email } from '#modules/account/email.type';
import { useTranslation } from '#shared/i18n/useTranslation';

export function InvalidChip({ email }: { email: Email }) {
  const { t } = useTranslation();
  const resendMutation = useMutation({
    mutationFn: () => resendVerificationEmailApi(email.email),
  });

  if (resendMutation.isIdle) {
    return (
      <Tooltip title={t('email.chip.sendMessage')}>
        <Chip
          icon={<ErrorOutline />}
          label={t('email.chip.unverified')}
          color={'primary'}
          size={'small'}
          onClick={() => resendMutation.mutate()}
        />
      </Tooltip>
    );
  }
  if (resendMutation.isLoading) {
    return (
      <Tooltip title={t('email.chip.sendMessage')}>
        <Chip
          icon={<CircularProgress size={'1em'} />}
          label={t('register.sendAgain')}
          color={'secondary'}
          variant={'outlined'}
          disabled={true}
          size={'small'}
        />
      </Tooltip>
    );
  }
  if (resendMutation.isError) {
    return (
      <Tooltip title={t('email.chip.sendError')}>
        <Chip
          icon={<Close />}
          label={t('email.chip.error')}
          color={'primary'}
          variant={'outlined'}
          onClick={() => resendMutation.mutate()}
          size={'small'}
        />
      </Tooltip>
    );
  }
  if (resendMutation.isSuccess) {
    return (
      <Tooltip title={t('email.chip.sendSuccess')}>
        <Chip
          icon={<Check />}
          label={t('email.chip.success')}
          color={'success'}
          variant={'outlined'}
          size={'small'}
        />
      </Tooltip>
    );
  }
}
