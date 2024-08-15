import { AdminPanelSettings } from '@mui/icons-material';
import { Button, Container, Divider, Typography } from '@mui/material';

import { useCurrentUserData } from '#modules/student/hooks/useCurrentUser.data';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

import { GroupTypeSection } from './components/GroupTypeSection';
import { useGroupTypes } from './hooks/useGroupTypes';

const PAGE_SIZE = 6;

export default function GroupTypesPage() {
  const { t } = useTranslation();
  const { listQueries, groupTypesQuery } = useGroupTypes(PAGE_SIZE);
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
    </Container>
  );
}
