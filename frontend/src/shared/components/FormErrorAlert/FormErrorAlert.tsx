import { useEffect, useRef } from 'react';

import { Alert } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface FormErrorAlertProps<T> {
  isError: boolean;
  error: ApiFormError<T> | null;
}

export function FormErrorAlert<T>({ isError, error }: FormErrorAlertProps<T>) {
  const { t } = useTranslation();
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError) {
      // scroll to the alert when it appears
      alertRef.current?.scrollIntoView();
    }
  }, [isError]);

  if (!isError) return null;

  return (
    <Alert severity="error" sx={{ mb: 1 }} ref={alertRef}>
      <span>{t('form.errors.title')}</span>
      {!!error?.globalErrors?.length && (
        <ul style={{ margin: 0, paddingInlineStart: 20 }}>
          {error.globalErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
    </Alert>
  );
}
