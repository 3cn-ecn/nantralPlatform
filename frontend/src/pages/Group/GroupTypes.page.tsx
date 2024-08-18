import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AdminPanelSettings } from '@mui/icons-material';
import { Button, Container, Divider, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { SearchField } from '#shared/components/FormFields';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { GroupTypeSection } from './components/GroupTypeSection';
import { useGroupTypes } from './hooks/useGroupTypes';

const PAGE_SIZE = 6;

export default function GroupTypesPage() {
  const { t } = useTranslation();
  const { listQueries, groupTypesQuery } = useGroupTypes(PAGE_SIZE);
  const { staff } = useCurrentUserData();
  const [params, setParams] = useSearchParams();
  const search = useMemo(() => params.get('search'), [params]);

  const groupSearchQuery = useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getGroupListApi({ search: search, pageSize: 6 * 3, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length + 1 : undefined,
    queryKey: ['groups', { search }],
    enabled: !!search,
  });

  return (
    <Container sx={{ my: 3 }}>
      <FlexRow justifyContent={'space-between'} alignItems="center" py={1}>
        <Typography variant="h1" mb={1}>
          {t('group.type.title')}
        </Typography>
        {staff && (
          <Button
            variant="contained"
            color="secondary"
            href="/admin/group/grouptype"
            startIcon={<AdminPanelSettings />}
          >
            {t('group.type.seeList')}
          </Button>
        )}
      </FlexRow>
      <Divider />
      <SearchField
        value={search}
        handleChange={(val) => {
          if (val) {
            setParams({ ...params, search: val }, { preventScrollReset: true });
          } else {
            params.delete('search');
            setParams(params, { preventScrollReset: true });
          }
        }}
        size="small"
        placeholder={t('group.search.placeholder')}
      />
      <Spacer vertical={2} />
      {!search && (
        <FlexCol gap={4}>
          {groupTypesQuery.isSuccess &&
            groupTypesQuery.data.results?.map((type, index) => (
              <GroupTypeSection
                key={type.slug}
                pageSize={PAGE_SIZE}
                type={type}
                groups={listQueries[index].data}
                isLoading={!listQueries[index] || listQueries[index].isLoading}
              />
            ))}
        </FlexCol>
      )}
      {search && (
        <InfiniteList query={groupSearchQuery}>
          <GroupGrid
            estimatedSize={6}
            isLoading={groupSearchQuery.isLoading}
            groups={groupSearchQuery.data?.pages.flatMap(
              (page) => page.results,
            )}
          />
          {groupSearchQuery.isFetchingNextPage && (
            <GroupGrid estimatedSize={6} isLoading />
          )}
          {groupSearchQuery.data?.pages[0].count === 0 && (
            <Typography>{t('group.list.noGroup')}</Typography>
          )}
        </InfiniteList>
      )}
    </Container>
  );
}
