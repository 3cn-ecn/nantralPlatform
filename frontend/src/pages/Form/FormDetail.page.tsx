import { useParams } from 'react-router';

import { Alert, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { ShowForm } from '#modules/form/view/shared/ShowForm';
import { ApiError } from '#shared/infra/errors';

export default function FormDetailPage() {
  const urlPathParams = useParams();
  const uuid = urlPathParams.uuid as string;

  const { data: jsonFormSchema, error: schemaError } = useQuery<
    JsonFormSchema,
    ApiError
  >({
    queryKey: ['jsonFormSchema', uuid],
    queryFn: () => getJsonSchemaApi(uuid),
  });

  return (
    <Container sx={{ my: 4 }}>
      {schemaError && (
        <Alert severity={'error'} sx={{ my: 1 }}>
          {schemaError.message}
        </Alert>
      )}

      {jsonFormSchema && <ShowForm jsonFormSchema={jsonFormSchema} />}
    </Container>
  );
}
