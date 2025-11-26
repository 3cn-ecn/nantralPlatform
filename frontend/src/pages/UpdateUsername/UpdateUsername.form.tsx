import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Divider } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import changeUsernameApi from '#modules/account/api/changeUsername.api';
import { UpdateUsernameFormFields } from '#modules/account/view/shared/UpdateUsernameFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export default function UpdateUsernameForm({ username }: { username: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const showToast = useToast();
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState({ username });
  // create all states for error, loading, etc. while fetching the API
  const { mutate, isPending, error } = useMutation<
    unknown,
    ApiFormError<{ username: string }>,
    { username?: string }
  >({
    mutationFn: changeUsernameApi,
    onSuccess: () => {
      showToast({
        message: t('username.success'),
        variant: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['username'],
      });
      navigate('/');
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutate(formValues);
      }}
      style={{ width: '100%' }}
    >
      {error?.response?.data?.non_field_errors && (
        <Alert severity="error">
          {error?.response?.data?.non_field_errors}
        </Alert>
      )}
      <UpdateUsernameFormFields
        formValues={formValues}
        updateFormValues={(newValues) =>
          setFormValues({ ...formValues, ...newValues })
        }
        error={error}
        isError={!!error}
        prevData={undefined}
      />
      <Divider flexItem />
      <Spacer vertical={2} />
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        loading={isPending}
      >
        {t('button.update')}
      </LoadingButton>
    </form>
  );
}
