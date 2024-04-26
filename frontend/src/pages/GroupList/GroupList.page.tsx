import { useSearchParams } from 'react-router-dom';

import { AdminPanelSettings } from '@mui/icons-material';
import { Button, Container, Paper, Typography } from '@mui/material';

import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { CreateGroupButton } from './components/CreateGroupButton';
import { useGroupList } from './hooks/useGroupList';
import { useGroupTypeDetails } from './hooks/useGroupTypeDetails';

export default function GroupListPage() {
  const [params] = useSearchParams();
  const type = params.get('type') || undefined;
  const { groupsByCategory, isSuccess, isLoading, count, ref } =
    useGroupList(type);
  const groupType = useGroupTypeDetails(type);
  const { staff } = useCurrentUserData();

  return (
    <Container sx={{ my: 4 }}>
      <FlexRow
        justifyContent={'space-between'}
        alignItems="center"
        flexWrap={'wrap'}
      >
        <Typography variant="h1" mb={1}>
          {groupType?.name}
        </Typography>
        {staff && (
          <FlexRow gap={2}>
            <Button
              variant="contained"
              color="secondary"
              href={`/admin/group/grouptype/${type}/change/`}
              startIcon={<AdminPanelSettings />}
            >
              Modifier Le Type
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href={`/admin/group/group/?group_type__slug__exact=${type}`}
              startIcon={<AdminPanelSettings />}
            >
              Voir la liste
            </Button>
          </FlexRow>
        )}
      </FlexRow>
      <Typography color="gray">{count} groupes</Typography>
      <Spacer vertical={3} />
      <FlexCol gap={4}>
        {isSuccess &&
          groupsByCategory &&
          Object.keys(groupsByCategory).map((cat) => (
            <Paper key={cat} sx={{ padding: 2 }}>
              <FlexCol>
                <Typography variant="h2" mb={2}>
                  {cat}
                </Typography>
                <GroupGrid estimatedSize={100} groups={groupsByCategory[cat]} />
                {isLoading && (
                  <GroupGrid
                    estimatedSize={100}
                    groups={groupsByCategory[cat]}
                    isLoading
                  />
                )}
              </FlexCol>
            </Paper>
          ))}
      </FlexCol>
      <div ref={ref} />
      {groupType?.canCreate && <CreateGroupButton groupType={groupType.slug} />}
    </Container>
  );
}
