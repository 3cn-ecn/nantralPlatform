import { useSearchParams } from 'react-router-dom';

import { AdminPanelSettings, ChevronRight } from '@mui/icons-material';
import { Button, Container, Divider, Typography } from '@mui/material';

import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { GroupGrid } from '../../modules/group/view/GroupGrid/GroupGrid';
import { MoreGroupButton } from './components/MoreGroupButton';
import { useGroupTypes } from './hooks/useGroupTypes';

const PAGE_SIZE = 6;

export default function GroupTypesPage() {
  const [, setParams] = useSearchParams();

  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { listQueries, groupTypesQuery } = useGroupTypes(PAGE_SIZE);

  const groupTypeResults = groupTypesQuery.data?.results?.filter(
    (_, i) =>
      listQueries[i].data &&
      ((listQueries[i].data?.count ?? 0) > 0 || isAuthenticated),
  );

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
        {groupTypesQuery.isSuccess &&
          groupTypeResults?.map((type, index) => (
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

              {listQueries && (
                <GroupGrid
                  estimatedSize={6}
                  isLoading={
                    !listQueries[index] || listQueries[index].isLoading
                  }
                  groups={listQueries[index].data?.results?.slice(
                    0,
                    (listQueries[index].data?.count || 0) > PAGE_SIZE
                      ? PAGE_SIZE - 1
                      : PAGE_SIZE,
                  )}
                  extraComponent={
                    (listQueries[index].data?.count || 0) > PAGE_SIZE ? (
                      <MoreGroupButton
                        count={
                          (listQueries[index].data?.count || 0) - PAGE_SIZE
                        }
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
