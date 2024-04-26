import { useSearchParams } from 'react-router-dom';

import { AdminPanelSettings, ChevronRight } from '@mui/icons-material';
import { Button, Container, Paper, Typography } from '@mui/material';
import { useQueries, useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { getGroupTypesApi } from '#modules/group/api/getGroupTypes.api';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useAuth } from '#shared/context/Auth.context';

import { GroupGrid } from '../../modules/group/view/GroupGrid/GroupGrid';

export default function GroupTypesPage() {
  const [, setParams] = useSearchParams();
  const { data: groupTypes, isSuccess } = useQuery({
    queryFn: getGroupTypesApi,
    queryKey: ['getGroupTypes'],
  });
  const { isAuthenticated } = useAuth();

  const results = useQueries({
    queries:
      groupTypes?.results.map((groupType) => ({
        queryFn: () => getGroupListApi({ type: groupType.slug, pageSize: 6 }),
        queryKey: ['getGroupList', groupType.slug, isAuthenticated],
        enabled: isSuccess,
      })) || [],
  });

  const { staff } = useCurrentUserData();
  return (
    <Container sx={{ my: 4 }}>
      <FlexRow justifyContent={'space-between'} alignItems="center">
        <Typography variant="h1" mb={1}>
          Groups
        </Typography>
        {staff && (
          <Button
            variant="contained"
            color="secondary"
            href="/admin/group/grouptype"
            startIcon={<AdminPanelSettings />}
          >
            Voir la liste
          </Button>
        )}
      </FlexRow>
      {isSuccess &&
        groupTypes?.results?.map((type, index) => (
          <FlexCol key={type.slug} justifyContent={'flex-start'}>
            <Paper sx={{ padding: 2, mb: 3, mt: 3 }}>
              <FlexRow alignItems="center" gap={2} mb={2}>
                <Typography variant="h2">{type.name}</Typography>
                <Button
                  onClick={() => setParams({ type: type.slug })}
                  variant="outlined"
                  endIcon={<ChevronRight />}
                >
                  See All
                </Button>
              </FlexRow>

              {results && (
                <GroupGrid
                  estimatedSize={6}
                  isLoading={results[index].isLoading}
                  groups={results[index].data?.results}
                />
              )}
            </Paper>
          </FlexCol>
        ))}
    </Container>
  );
}
