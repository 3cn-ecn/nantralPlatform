import { useState } from 'react';

import { Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addEmailApi } from '#modules/account/api/addEmail.api';
import { Email } from '#modules/account/email.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function EmailForm() {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<string[] | undefined>(undefined);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const emailMutation = useMutation<
    Email,
    ApiFormError<{ email: string }>,
    string
  >({
    mutationFn: addEmailApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['emails'],
      });
      setEmail('');
    },
    onError: (e: ApiFormError<{ email: string }>) => {
      if (!e.fields.email) {
        setFormErrors(e.globalErrors);
      } else if (!e.globalErrors) {
        setFormErrors(e.fields.email);
      } else {
        setFormErrors(e.globalErrors.concat(e.fields.email));
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        emailMutation.mutate(email);
      }}
    >
      <FlexRow gap={2}>
        <TextField
          name="email"
          label={t('email.form.label')}
          value={email}
          handleChange={(val) => {
            setEmail(val);
            emailMutation.reset();
          }}
          size={'small'}
          errors={formErrors}
        />
        <Box sx={{ mt: 2, mb: 1 }}>
          <LoadingButton
            loading={emailMutation.isPending}
            variant={'outlined'}
            type={'submit'}
          >
            {t('button.add')}
          </LoadingButton>
        </Box>
      </FlexRow>
    </form>
  );
}
