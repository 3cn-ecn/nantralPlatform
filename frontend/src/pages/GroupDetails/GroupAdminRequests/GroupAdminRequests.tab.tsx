import { Container, Stack, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getAdminRequestListApi } from '#modules/group/api/getAdminRequestList.api';
import { Group } from '#modules/group/types/group.types';
import { useTranslation } from '#shared/i18n/useTranslation';

import { AdminRequestRow } from '../components/AdminRequestRow';

export function GroupAdminRequests({ group }: { group: Group }) {
  const { t } = useTranslation();
  const { data } = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getAdminRequestListApi(group.slug, { page: pageParam }),
    queryKey: ['adminRequest', { slug: group.slug }],
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });
  return (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        {data?.pages
          .map((page) => page.results)
          .flat()
          .map((adminRequest) => (
            <AdminRequestRow
              key={adminRequest.id}
              adminRequest={adminRequest}
              groupSlug={group.slug}
            />
          ))}
      </Stack>
      {data?.pages[0].count == 0 && (
        <Typography color="secondary" sx={{ mt: 3, textAlign: 'center' }}>
          {t('group.details.noAdminReqests')}
        </Typography>
      )}
    </Container>
  );
}
