import { Link } from 'react-router';

import AddIcon from '@mui/icons-material/Add';
import {
  Container,
  Fab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getFormListApi } from '#modules/form/api/getFormList.api';
import {
  FormListItem,
  FormListItemSkeleton,
} from '#pages/Form/components/List/FormListItem';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function FormListPage() {
  const { t } = useTranslation();
  const formsQuery = useInfiniteQuery({
    queryKey: ['forms'],
    queryFn: ({ pageParam }) => getFormListApi({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });

  return (
    <Container sx={{ pt: 4, pb: 7 }}>
      <Typography variant={'h1'} sx={{ mb: 3 }}>
        {t('jsonForm.list.title')}
      </Typography>
      <InfiniteList query={formsQuery}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('jsonForm.list.name')}</TableCell>
                <TableCell>{t('jsonForm.list.role')}</TableCell>
                <TableCell>{t('jsonForm.list.action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formsQuery.data?.pages
                .flatMap((page) => page.results)
                .map((formPreview) => (
                  <FormListItem
                    key={formPreview.uuid}
                    formPreview={formPreview}
                  />
                ))}
              {formsQuery.isPending && (
                <>
                  <FormListItemSkeleton />
                  <FormListItemSkeleton />
                  <FormListItemSkeleton />
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteList>
      <Fab
        variant={'extended'}
        color={'primary'}
        size={'large'}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        component={Link}
        to={'new/'}
      >
        <AddIcon sx={{ mr: 1 }} />
        {t('jsonForm.list.new')}
      </Fab>
    </Container>
  );
}
