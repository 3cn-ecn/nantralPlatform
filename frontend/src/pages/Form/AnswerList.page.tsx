import { useParams } from 'react-router';

import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { UUID } from 'crypto';

import { getAnswerListApi } from '#modules/form/api/getAnswerList.api';
import { getJsonSchemaApi } from '#modules/form/api/getJsonSchema.api';
import { FormItemActions } from '#modules/form/view/shared/FormItemActions';
import {
  AnswerListItem,
  AnswerListItemSkeleton,
} from '#pages/Form/components/Answers/AnswerListItem';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function AnswerListPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const { data: formSchema } = useSuspenseQuery({
    queryKey: ['form', uuid],
    queryFn: () => {
      if (uuid) return getJsonSchemaApi(uuid);
      throw 'Invalid Id';
    },
  });

  const answerQuery = useInfiniteQuery({
    queryKey: ['answers', uuid],
    queryFn: ({ pageParam }) => {
      if (uuid)
        return getAnswerListApi(uuid as UUID, {
          page: pageParam,
          pageSize: 10,
        });
      throw 'Invalid form id';
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        gap={2}
        mb={3}
      >
        <Typography variant={'h1'}>
          {t('jsonForm.answers.title', { name: formSchema.name })}
        </Typography>
        <FormItemActions formPreview={formSchema} />
      </Stack>
      {(answerQuery.data?.pages.at(0)?.count && (
        <InfiniteList query={answerQuery}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2}>
                    {t('jsonForm.answers.user')}
                  </TableCell>
                  <TableCell>{t('jsonForm.answers.date')}</TableCell>
                  <TableCell>{t('jsonForm.answers.action')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {answerQuery.data?.pages
                  .flatMap((page) => page.results)
                  .map((answer) => (
                    <AnswerListItem key={answer.uuid} answer={answer} />
                  ))}
                {answerQuery.isPending && (
                  <>
                    <AnswerListItemSkeleton />
                    <AnswerListItemSkeleton />
                    <AnswerListItemSkeleton />
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </InfiniteList>
      )) || <Typography>{t('jsonForm.answers.noAnswers')}</Typography>}
    </Container>
  );
}
