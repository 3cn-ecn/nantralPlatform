import { useCallback, useState } from 'react';

import { Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { addEmailApi } from '#modules/account/api/addEmail.api';
import { Email } from '#modules/account/email.type';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function EmailForm({ studentId }: { studentId: number }) {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const emailMutation = useMutation<
    Email,
    ApiFormError<{ email: string }>,
    string
  >({
    mutationFn: (value) => addEmailApi(value, studentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['emails']);
      setEmail('');
    },
  });
  const getAllErrorsCallback = useCallback(() => {
    if (!emailMutation.error?.fields.email) {
      return emailMutation.error?.globalErrors;
    } else if (!emailMutation.error?.globalErrors) {
      return emailMutation.error?.fields.email;
    }
    return emailMutation.error.globalErrors.concat(
      emailMutation.error.fields.email,
    );
  }, [emailMutation.error?.fields.email, emailMutation.error?.globalErrors]);
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
          errors={getAllErrorsCallback()}
        />
        <Box sx={{ mt: 2, mb: 1 }}>
          <LoadingButton
            loading={emailMutation.isLoading}
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
