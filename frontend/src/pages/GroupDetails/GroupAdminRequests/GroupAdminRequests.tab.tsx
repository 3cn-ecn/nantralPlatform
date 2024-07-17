import { Container } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getAdminRequestListApi } from '#modules/group/api/getAdminRequestList.api';
import { Group } from '#modules/group/types/group.types';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

import { AdminRequestRow } from '../components/AdminRequestRow';

export function GroupAdminRequests({ group }: { group: Group }) {
  const { data } = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getAdminRequestListApi(group.slug, { page: pageParam }),
    queryKey: ['membership', 'adminRequest', { slug: group.slug }],
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
              group={group}
            />
          ))}
      </FlexCol>
    </Container>
  );
}
