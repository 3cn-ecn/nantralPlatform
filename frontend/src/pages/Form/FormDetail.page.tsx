import { useParams } from 'react-router';

import { Alert, CircularProgress, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { getAnswerApi } from '#modules/form/api/getAnswers.api';
import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { ShowForm } from '#modules/form/view/shared/ShowForm';
import { ApiError } from '#shared/infra/errors';

export default function FormDetailPage() {
  const urlPathParams = useParams();
  const uuid = urlPathParams.uuid as UUID;
  const userId = useCurrentUserData().id;

  const {
    data: jsonFormSchema,
    error: schemaError,
    isPending,
  } = useQuery<JsonFormSchema, ApiError>({
    queryKey: ['jsonFormSchema', uuid],
    queryFn: () => getJsonSchemaApi(uuid),
  });

  const {
    data: answer,
    error: answerError,
    isPending: isAnswerLoading,
  } = useQuery({
    queryKey: ['answers', uuid],
    queryFn: () => getAnswerApi(uuid, { user: userId }),
  });

  return (
    <Container sx={{ py: 4 }}>
      {(isPending || isAnswerLoading) && <CircularProgress />}

      {schemaError && (
        <Alert severity={'error'} sx={{ my: 1 }}>
          {schemaError.message}
        </Alert>
      )}
      {answerError && (
        <Alert severity={'error'} sx={{ my: 1 }}>
          {answerError.message}
        </Alert>
      )}

      {jsonFormSchema && answer && (
        <ShowForm
          jsonFormSchema={jsonFormSchema}
          initialData={answer.results[0]}
        />
      )}
    </Container>
  );
}
