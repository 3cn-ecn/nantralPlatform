import { useSearchParams } from 'react-router-dom';

import { AdminPanelSettings } from '@mui/icons-material';
import {
  Button,
  Container,
  Divider,
  Skeleton,
  Typography,
} from '@mui/material';

import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { InfiniteList } from '#shared/components/InfiniteList/InfiniteList';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { CreateGroupButton } from './components/CreateGroupButton';
import { useGroupList } from './hooks/useGroupList';
import { useGroupTypeDetails } from './hooks/useGroupTypeDetails';

export default function GroupListPage() {
  const [params] = useSearchParams();
  const type = params.get('type') || undefined;
  const { groupsByCategory, query: groupListQuery, count } = useGroupList(type);
  const { t } = useTranslation();
  const groupTypeQuery = useGroupTypeDetails(type);
  const { staff } = useCurrentUserData();

  return (
    <Container sx={{ my: 3 }}>
      <FlexRow
        justifyContent={'space-between'}
        alignItems="center"
        flexWrap={'wrap'}
        py={1}
      >
        <FlexRow alignItems={'center'} gap={1} mb={1}>
          <Typography variant="h1">
            {groupTypeQuery.isLoading || groupListQuery.isLoading ? (
              <Skeleton width={250} variant="text" />
            ) : (
              `${groupTypeQuery.data?.name} (${count})`
            )}
          </Typography>
        </FlexRow>

        {staff && (
          <FlexRow gap={2}>
            <Button
              variant="contained"
              color="secondary"
              href={`/admin/group/grouptype/${type}/change/`}
              startIcon={<AdminPanelSettings />}
            >
              {t('group.list.editType')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href={`/admin/group/group/?group_type__slug__exact=${type}`}
              startIcon={<AdminPanelSettings />}
            >
              {t('group.type.seeList')}
            </Button>
          </FlexRow>
        )}
      </FlexRow>
      <Divider />
      <Spacer vertical={2} />
      <InfiniteList query={groupListQuery}>
        <FlexCol gap={4}>
          {groupListQuery.isSuccess &&
            groupsByCategory &&
            Object.keys(groupsByCategory).map((cat) => (
              <FlexCol key={cat}>
                <Typography variant="h2" mb={4}>
                  {cat}
                </Typography>
                <GroupGrid estimatedSize={100} groups={groupsByCategory[cat]} />
                {(groupListQuery.isLoading ||
                  groupListQuery.isFetchingNextPage) && (
                  <GroupGrid
                    estimatedSize={100}
                    groups={groupsByCategory[cat]}
                    isLoading
                  />
                )}
              </FlexCol>
            ))}
        </FlexCol>
      </InfiniteList>
      {groupListQuery.data?.pages[0].count === 0 && (
        <Typography>{t('group.list.noGroup')}</Typography>
      )}
      {groupTypeQuery.data?.canCreate && (
        <CreateGroupButton groupType={groupTypeQuery.data} />
      )}
    </Container>
  );
}
