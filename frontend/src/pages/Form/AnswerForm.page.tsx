import { useLoaderData } from 'react-router';

import { Alert, CircularProgress, Container } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { getAnswerApi } from '#modules/form/api/getAnswers.api';
import { ShowForm } from '#modules/form/view/shared/ShowForm';

export default function AnswerFormPage() {
  const { formSchema } = useLoaderData();
  const userId = useCurrentUserData().id;

  const {
    data: answer,
    error: answerError,
    isPending: isAnswerPending,
  } = useQuery({
    queryKey: ['answers', formSchema.uuid],
    queryFn: () => getAnswerApi(formSchema.uuid, { user: userId }),
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
        <ShowForm jsonFormSchema={formSchema} initialData={answer.results[0]} />
      )}
    </Container>
  );
}
