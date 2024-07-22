import { useSearchParams } from 'react-router-dom';

import { AdminPanelSettings, ChevronRight } from '@mui/icons-material';
import { Button, Container, Divider, Typography } from '@mui/material';
import { useQueries, useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { getGroupTypesApi } from '#modules/group/api/getGroupTypes.api';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { GroupGrid } from '../../modules/group/view/GroupGrid/GroupGrid';
import { MoreGroupButton } from './components/MoreGroupButton';

const PAGE_SIZE = 6;

export default function GroupTypesPage() {
  const [, setParams] = useSearchParams();
  const { data: groupTypes, isSuccess } = useQuery({
    queryFn: getGroupTypesApi,
    queryKey: ['getGroupTypes'],
  });
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const results = useQueries({
    queries:
      groupTypes?.results.map((groupType) => ({
        queryFn: () =>
          getGroupListApi({ type: groupType.slug, pageSize: PAGE_SIZE }),
        queryKey: ['getGroupList', groupType.slug, isAuthenticated],
        enabled: isSuccess,
      })) || [],
  });

  const { staff } = useCurrentUserData();
  return (
    <Container sx={{ my: 4 }}>
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
      <Spacer vertical={2} />
      <FlexCol gap={4}>
        {isSuccess &&
          groupTypes?.results?.map((type, index) => (
            <FlexCol key={type.slug} justifyContent={'flex-start'}>
              <FlexRow alignItems="center" gap={2} mb={4}>
                <Typography variant="h2">{type.name}</Typography>
                <Button
                  onClick={() => setParams({ type: type.slug })}
                  variant="outlined"
                  endIcon={<ChevronRight />}
                >
                  {t('group.type.seeAll')}
                </Button>
              </FlexRow>

              {results && (
                <GroupGrid
                  estimatedSize={6}
                  isLoading={!results[index] || results[index].isLoading}
                  groups={results[index].data?.results?.slice(
                    0,
                    results[index].data?.count > PAGE_SIZE
                      ? PAGE_SIZE - 1
                      : PAGE_SIZE,
                  )}
                  extraComponent={
                    (results[index].data?.count || 0) > PAGE_SIZE ? (
                      <MoreGroupButton
                        count={(results[index].data?.count || 0) - PAGE_SIZE}
                        onClick={() => setParams({ type: type.slug })}
                      />
                    ) : undefined
                  }
                />
              )}
            </FlexCol>
          ))}
      </FlexCol>
    </Container>
  );
}
