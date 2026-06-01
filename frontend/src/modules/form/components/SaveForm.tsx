import { useMemo } from 'react';

import { useMutation } from '@tanstack/react-query';

import { createJsonSchemaApi } from '#modules/form/api/createJsonSchema.api';
import { updateJsonSchemaApi } from '#modules/form/api/updateJsonSchema.api';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';
import { exportTree } from '#modules/form/state/JsonFormReducer';
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
  const { jsonForm } = useJsonForm();
  const jsonFormSchema = useMemo(() => exportTree(jsonForm), [jsonForm]);
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
