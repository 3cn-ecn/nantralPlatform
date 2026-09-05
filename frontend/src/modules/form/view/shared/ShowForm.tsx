import { useCallback, useMemo, useState } from 'react';

import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Alert, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { ErrorObject } from 'ajv';

import { postJsonFormApi } from '#modules/form/api/postJsonForm.api';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import BooleanControl, {
  booleanControlTester,
} from '#modules/form/view/renderers/BooleanControl';
import DateControl, {
  dateTimeControlTester,
} from '#modules/form/view/renderers/DateTimeControl';
import NumberControl, {
  numberControlTester,
} from '#modules/form/view/renderers/NumberControl';
import RichLabelRenderer, {
  richLabelRendererTester,
} from '#modules/form/view/renderers/RichLabelRenderer';
import RowControl, {
  rowControlTester,
} from '#modules/form/view/renderers/RowControl';
import TableControl, {
  tableControlTester,
} from '#modules/form/view/renderers/TableControl';
import TextControl, {
  textControlTester,
} from '#modules/form/view/renderers/TextControl';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

export function ShowForm({
  jsonFormSchema,
}: {
  jsonFormSchema: JsonFormSchema;
}) {
  const [data, setData] = useState({});

  const namespace = 'form-' + jsonFormSchema.uuid;
  const { t } = useTranslation();

  const {
    t: formT,
    currentBaseLanguage: formBaseLanguage,
    i18n: formI18n,
  } = useTranslation(namespace);

  const createTranslator = useCallback(
    (schema: JsonFormSchema | undefined) => {
      if (!schema)
        return (key: string, defaultMessage?: string) => defaultMessage ?? '';

      const namespace = 'form-' + schema.uuid;

      formI18n.addResourceBundle('en-EN', namespace, schema.i18nKeys.en);
      formI18n.addResourceBundle('fr-FR', namespace, schema.i18nKeys.fr);

      return (key: string, defaultMessage?: string) =>
        formI18n.exists(key, { ns: namespace })
          ? formT(key, { ns: namespace })
          : (defaultMessage ?? '');
    },
    [formI18n, formT],
  );

  const translate = useMemo(
    () => createTranslator(jsonFormSchema),
    [createTranslator, jsonFormSchema],
  );

  const { mutate, isPending, error } = useMutation<
    number,
    ErrorObject[],
    object
  >({
    mutationFn: (data: object) =>
      postJsonFormApi(jsonFormSchema.uuid, {
        data,
      }),
    onSuccess() {
      // Handle successful submission
      setData({});
    },
  });
  return (
    <>
      <Typography variant={'h1'}>
        {jsonFormSchema.name ?? t('jsonForm.form.loadingTitle')}
      </Typography>
      <Typography>{jsonFormSchema.description}</Typography>
      {error
        ?.filter((e) => e.instancePath === '/')
        .map((e) => (
          <Alert key={e.message} severity={'error'} sx={{ my: 1 }}>
            {e.message}
          </Alert>
        ))}
      <JsonForms
        schema={jsonFormSchema.schema}
        uischema={jsonFormSchema.uiSchema}
        data={data}
        renderers={[
          { tester: textControlTester, renderer: TextControl },
          { tester: numberControlTester, renderer: NumberControl },
          { tester: booleanControlTester, renderer: BooleanControl },
          { tester: dateTimeControlTester, renderer: DateControl },
          { tester: rowControlTester, renderer: RowControl },
          { tester: tableControlTester, renderer: TableControl },
          { tester: richLabelRendererTester, renderer: RichLabelRenderer },
          ...materialRenderers,
        ]}
        cells={materialCells}
        additionalErrors={error ?? undefined}
        validationMode={error ? 'ValidateAndHide' : 'ValidateAndShow'}
        onChange={({ data }) => setData(data)}
        i18n={{
          locale: formBaseLanguage,
          translate,
        }}
      />
      <LoadingButton onClick={() => mutate(data)} loading={isPending}>
        {t('button.send')}
      </LoadingButton>
    </>
  );
}
