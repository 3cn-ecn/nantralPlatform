import { useQuery } from '@tanstack/react-query';

import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { useJsonForm } from '#modules/form/hooks/useJsonForm';

export function ImportForm({ uuid }: { uuid: string }) {
  const { importForm } = useJsonForm();
  const formQuery = useQuery({
    queryKey: ['formSchema', uuid],
    queryFn: () =>
      getJsonSchemaApi(uuid).then((formSchema) => importForm(formSchema)),
  });
  return null;
}
