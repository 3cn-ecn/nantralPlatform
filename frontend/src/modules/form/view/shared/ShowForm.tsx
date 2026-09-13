import { useCallback, useMemo, useState } from 'react';

import { Translator } from '@jsonforms/core';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import ResetIcon from '@mui/icons-material/Restore';
import SendIcon from '@mui/icons-material/Send';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorObject } from 'ajv';

import { postJsonFormAnswerApi } from '#modules/form/api/postJsonFormAnswer.api';
import { updateJsonFormAnswerApi } from '#modules/form/api/updateJsonFormAnswer.api';
import {
  JsonFormAnswer,
  JsonFormSchema,
} from '#modules/form/types/jsonForm.type';
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
import { FormItemActions } from '#modules/form/view/shared/FormItemActions';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

export function ShowForm({
  jsonFormSchema,
  initialData,
}: {
  jsonFormSchema: JsonFormSchema;
  initialData?: JsonFormAnswer;
}) {
  const [data, setData] = useState(initialData?.data ?? {});
  const [hasErrors, setHasErrors] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const showToast = useToast();

  const namespace = 'form-' + jsonFormSchema.uuid;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    t: formT,
    currentBaseLanguage: formBaseLanguage,
    i18n: formI18n,
  } = useTranslation(namespace);

  const createTranslator = useCallback(
    (schema: JsonFormSchema | undefined) => {
      if (!schema)
        return (key: string, defaultMessage?: string) => defaultMessage;

      const namespace = 'form-' + schema.uuid;

      formI18n.addResourceBundle('en-EN', namespace, schema.i18nKeys.en);
      formI18n.addResourceBundle('fr-FR', namespace, schema.i18nKeys.fr);

      return (key: string, defaultMessage?: string) => {
        return formI18n.exists(key, { ns: namespace })
          ? formT(key, { ns: namespace })
          : defaultMessage;
      };
    },
    [formI18n, formT],
  );

  const translate = useMemo(
    () => createTranslator(jsonFormSchema),
    [createTranslator, jsonFormSchema],
  );

  const mutationFn = useMemo(
    () =>
      initialData === undefined
        ? (data) => postJsonFormAnswerApi(jsonFormSchema.uuid, data)
        : (data) =>
            updateJsonFormAnswerApi(
              jsonFormSchema.uuid,
              initialData.uuid,
              data,
            ),
    [initialData, jsonFormSchema.uuid],
  );

  const { mutate, isPending, error } = useMutation<
    number,
    ErrorObject[],
    object
  >({
    mutationFn,
    onSuccess() {
      // Handle successful submission
      showToast({
        variant: 'success',
        message: t('jsonForm.answer.saved'),
      });
      queryClient.invalidateQueries({
        queryKey: ['answers', jsonFormSchema.uuid],
      });
    },
    onError(err) {
      if ('message' in err && typeof err.message === 'string')
        showToast({
          variant: 'error',
          message: err.message,
        });
    },
    onSettled() {
      setSubmitOpen(false);
    },
  });

  return (
    <Stack gap={2}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={2}
      >
        <Typography variant={'h1'}>
          {jsonFormSchema.name ?? t('jsonForm.answer.loadingTitle')}
        </Typography>
        <FormItemActions formPreview={jsonFormSchema} />
      </Stack>
      {error
        ?.filter((e) => e.instancePath === '/')
        .map((e) => (
          <Alert key={e.message} severity={'error'} sx={{ my: 1 }}>
            {e.message}
          </Alert>
        ))}
      <Box>
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
          onChange={({ data, errors }) => {
            setData(data);
            setHasErrors(errors !== undefined && errors.length > 0);
          }}
          i18n={{
            locale: formBaseLanguage,
            translate: translate as Translator,
          }}
        />
      </Box>
      <Stack
        direction={'row'}
        gap={2}
        alignSelf={'center'}
        alignItems={'center'}
        position={'fixed'}
        bottom={24}
      >
        <Fab
          variant={'extended'}
          color={'secondary'}
          size={'small'}
          onClick={() => setResetOpen(true)}
        >
          <ResetIcon sx={{ mr: 1 }} />
          {t('button.reset')}
        </Fab>
        {resetOpen && (
          <ConfirmationModal
            title={t('jsonForm.answer.resetTitle')}
            body={t('jsonForm.answer.resetBody')}
            onCancel={() => setResetOpen(false)}
            onConfirm={() => {
              setData({});
              setResetOpen(false);
            }}
          />
        )}
        <Fab
          variant={'extended'}
          color={'primary'}
          onClick={() => setSubmitOpen(true)}
        >
          <SendIcon sx={{ mr: 1 }} />
          {t('button.send')}
        </Fab>
        {submitOpen && !hasErrors && (
          <ConfirmationModal
            title={t('jsonForm.answer.submitTitle')}
            body={t('jsonForm.answer.submitBody')}
            onCancel={() => setSubmitOpen(false)}
            onConfirm={() => mutate(data)}
            loading={isPending}
          />
        )}
        <Dialog
          open={submitOpen && hasErrors}
          onClose={() => setSubmitOpen(false)}
        >
          <DialogTitle>{t('jsonForm.answer.hasErrors.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('jsonForm.answer.hasErrors.body')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSubmitOpen(false)}>
              {t('button.back')}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Stack>
  );
}
