import { useParams } from 'react-router';

import { Alert, CircularProgress, Container } from '@mui/material';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { getAnswerListApi } from '#modules/form/api/getAnswerList.api';
import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { JsonFormAnswer } from '#modules/form/types/jsonForm.type';
import { ShowForm } from '#modules/form/view/shared/ShowForm';

export default function AnswerFormPage() {
  const { uuid } = useParams();
  const { data: formSchema } = useSuspenseQuery({
    queryKey: ['form', uuid],
    queryFn: () => {
      if (uuid) return getJsonSchemaApi(uuid);
      throw 'Invalid Id';
    },
  });

  const userId = useCurrentUserData().id;

  const {
    data: answer,
    error: answerError,
    isPending: isAnswerPending,
  } = useQuery({
    queryKey: ['answers', formSchema.uuid, { user: userId, preview: false }],
    queryFn: () =>
      getAnswerListApi(formSchema.uuid, { user: userId, preview: false }),
  });

  return (
    <Container sx={{ py: 4 }}>
      {isAnswerPending && <CircularProgress />}

      {answerError && (
        <Alert severity={'error'} sx={{ my: 1 }}>
          {answerError.message}
        </Alert>
      )}

      {formSchema && answer && (
        <ShowForm
          jsonFormSchema={formSchema}
          initialData={answer.results[0] as JsonFormAnswer}
        />
      )}
    </Container>
  );
}
