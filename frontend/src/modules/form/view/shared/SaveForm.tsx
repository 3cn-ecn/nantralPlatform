import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useMutation } from '@tanstack/react-query';
import { omit } from 'lodash';

import { createJsonSchemaApi } from '#modules/form/api/createJsonSchema.api';
import { updateJsonSchemaApi } from '#modules/form/api/updateJsonSchema.api';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { nodeToJsonForm } from '#modules/form/state/utils';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';

export function SaveForm() {
  const { form } = useFormContext();
  const jsonFormSchema = useMemo(() => nodeToJsonForm(form), [form]);
  const params = useParams();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn:
      // Check path to determine if we need to update or create
      'uuid' in params
        ? (schema: Omit<JsonFormSchema, 'uuid'>) =>
            updateJsonSchemaApi(form.uuid, schema)
        : createJsonSchemaApi,
    // continue editing after creating form
    onSuccess: (data) => !('uuid' in params) && navigate(`/form/${data.uuid}/`),
  });
  return (
    <LoadingButton
      loading={isPending}
      onClick={() => mutate(omit(jsonFormSchema, 'uuid'))}
      sx={{ alignSelf: 'center' }}
      size={'large'}
      variant={'outlined'}
    >
      Save
    </LoadingButton>
  );
}
