import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { createJsonSchemaApi } from '#modules/form/api/createJsonSchema.api';
import { updateJsonSchemaApi } from '#modules/form/api/updateJsonSchema.api';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { nodeToJsonForm } from '#modules/form/state/utils';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';

export function SaveForm({
  name,
  description,
  uuid,
}: {
  name: string;
  description: string;
  uuid?: string;
}) {
  const { form } = useFormContext();
  const jsonFormSchema = useMemo(() => nodeToJsonForm(form), [form]);
  const { mutate, isPending } = useMutation({
    mutationFn: uuid
      ? (schema: Omit<JsonFormSchema, 'uuid'>) =>
          updateJsonSchemaApi(uuid, schema)
      : createJsonSchemaApi,
  });
  return (
    <LoadingButton
      loading={isPending}
      onClick={() => mutate({ ...jsonFormSchema, name, description })}
      sx={{ alignSelf: 'center' }}
      size={'large'}
      variant={'outlined'}
    >
      Save
    </LoadingButton>
  );
}
