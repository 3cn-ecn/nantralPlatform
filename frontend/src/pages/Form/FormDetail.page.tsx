import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Alert, Container, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ErrorObject } from 'ajv';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { postJsonFormApi } from '#modules/form/api/postJsonForm.api';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import {
  createFormNamespace,
  FORM_CONFIG,
} from '#modules/form/utils/constants';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';

export default function FormDetailPage() {
  const currentUserData = useCurrentUserData();
  const [data, setData] = useState({});
  const urlPathParams = useParams();
  const uuid = urlPathParams.uuid as string;

  const namespace = createFormNamespace(uuid);

  const { t, currentBaseLanguage, i18n } = useTranslation(namespace);

  const {
    data: jsonFormSchema,
    error: schemaError,
    isLoading: isSchemaLoading,
  } = useQuery<JsonFormSchema, ApiError>({
    queryKey: ['jsonFormSchema', uuid],
    queryFn: () => getJsonSchemaApi(uuid),
  });

  const createTranslator = useCallback(
    (schema: JsonFormSchema | undefined) => {
      if (!schema)
        return (key: string, defaultMessage?: string) => defaultMessage ?? '';

      const namespace = createFormNamespace(schema.uuid);

      i18n.addResourceBundle(
        FORM_CONFIG.LANGUAGES.EN,
        namespace,
        schema.i18nKeys_en,
      );
      i18n.addResourceBundle(
        FORM_CONFIG.LANGUAGES.FR,
        namespace,
        schema.i18nKeys_fr,
      );

      return (key: string, defaultMessage?: string) =>
        i18n.exists(key, { ns: namespace })
          ? t(key, { ns: namespace })
          : (defaultMessage ?? '');
    },
    [i18n, t],
  );

  const translate = useMemo(
    () => createTranslator(jsonFormSchema),
    [createTranslator, jsonFormSchema],
  );

  const { mutate, isLoading, error } = useMutation<
    number,
    ErrorObject[],
    object
  >({
    mutationFn: (data: object) =>
      postJsonFormApi(uuid, {
        data,
        user: currentUserData.id,
      }),
    onSuccess() {
      // Handle successful submission
      setData({});
    },
  });

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant={'h1'}>
        {jsonFormSchema?.name ?? t('jsonForm.form.loadingTitle')}
      </Typography>
      <Typography>{jsonFormSchema?.description}</Typography>

      {error
        ?.filter((e) => e.instancePath === '/')
        .map((e) => (
          <Alert key={e.message} severity={'error'} sx={{ my: 1 }}>
            {e.message}
          </Alert>
        ))}

      {schemaError && (
        <Alert severity={'error'} sx={{ my: 1 }}>
          {schemaError.message}
        </Alert>
      )}

      {jsonFormSchema && (
        <JsonForms
          schema={jsonFormSchema.schema}
          uischema={jsonFormSchema.uiSchema}
          data={data}
          renderers={[...materialRenderers]}
          cells={materialCells}
          additionalErrors={error ?? undefined}
          validationMode={error ? 'ValidateAndHide' : 'ValidateAndShow'}
          onChange={({ data }) => setData(data)}
          i18n={{ locale: currentBaseLanguage, translate }}
        />
      )}

      <LoadingButton
        onClick={() => mutate(data)}
        loading={isLoading || isSchemaLoading}
        disabled={Boolean(schemaError)}
      >
        {t('button.send')}
      </LoadingButton>

      {/* Debug view - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Typography
          component="pre"
          variant="caption"
          sx={{ mt: 2, p: 2, overflow: 'auto' }}
        >
          {JSON.stringify(data, null, 2)}
        </Typography>
      )}
    </Container>
  );
}
