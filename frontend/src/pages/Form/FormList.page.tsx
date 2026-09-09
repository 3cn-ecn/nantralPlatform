import { Link } from 'react-router';

import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Container,
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
} from '#modules/form/view/shared/FormListItem';
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
    <Container sx={{ py: 3 }}>
      <Typography variant={'h1'} sx={{ mb: 3 }}>
        {t('jsonForm.list.title')}
      </Typography>
      <InfiniteList query={formsQuery}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Form</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
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
      <Button
        size={'large'}
        variant={'contained'}
        component={Link}
        to={'new/'}
        startIcon={<AddIcon />}
        sx={{ mt: 3 }}
      >
        {t('jsonForm.list.new')}
      </Button>
    </Container>
  );
}
