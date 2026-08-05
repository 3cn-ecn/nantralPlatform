import { useQuery } from '@tanstack/react-query';

import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { jsonFormToNode } from '#modules/form/state/utils';

export function ImportForm({ uuid }: { uuid: string }) {
  const { setForm } = useFormContext();
  useQuery({
    queryKey: ['formSchema', uuid],
    queryFn: () =>
      getJsonSchemaApi(uuid).then((formSchema) =>
        setForm(jsonFormToNode(formSchema)),
      ),
  });
  return null;
}
