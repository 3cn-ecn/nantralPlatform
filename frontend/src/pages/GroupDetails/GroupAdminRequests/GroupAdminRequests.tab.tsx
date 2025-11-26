import { Container, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getAdminRequestListApi } from '#modules/group/api/getAdminRequestList.api';
import { Group } from '#modules/group/types/group.types';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { AdminRequestRow } from '../components/AdminRequestRow';

export function GroupAdminRequests({ group }: { group: Group }) {
  const { t } = useTranslation();
  const { data } = useInfiniteQuery({
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAdminRequestListApi(group.slug, { page: pageParam }),
    queryKey: ['adminRequest', { slug: group.slug }],
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
  });
  return (
    <Container maxWidth="sm">
      <FlexCol gap={2}>
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
      </FlexCol>
      {data?.pages[0].count == 0 && (
        <Typography color="secondary" mt={3} textAlign="center">
          {t('group.details.noAdminReqests')}
        </Typography>
      )}
    </Container>
  );
}
