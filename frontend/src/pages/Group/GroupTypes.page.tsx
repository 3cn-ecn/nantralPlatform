import { useSearchParams } from 'react-router-dom';

import { Add, AdminPanelSettings, ChevronRight } from '@mui/icons-material';
import { Button, Container, Divider, Fab, Typography } from '@mui/material';
import { useQueries, useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { getGroupTypesApi } from '#modules/group/api/getGroupTypes.api';
import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';

import { GroupGrid } from '../../modules/group/view/GroupGrid/GroupGrid';

const PAGE_SIZE = 5;

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
        queryFn: () =>
          getGroupListApi({ type: groupType.slug, pageSize: PAGE_SIZE }),
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
                  See All
                </Button>
              </FlexRow>

              {results && results[index]?.data && (
                <GroupGrid
                  estimatedSize={6}
                  isLoading={results[index].isLoading}
                  groups={results[index].data?.results}
                  extraComponent={
                    results[index].data.count > PAGE_SIZE ? (
                      <FlexCol
                        alignItems={'center'}
                        justifyContent={'center'}
                        height={'100%'}
                      >
                        <Fab
                          onClick={() => setParams({ type: type.slug })}
                          variant="extended"
                          sx={{ fontSize: 20 }}
                        >
                          <Add />
                          {results[index].data.count - PAGE_SIZE}
                        </Fab>
                      </FlexCol>
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
