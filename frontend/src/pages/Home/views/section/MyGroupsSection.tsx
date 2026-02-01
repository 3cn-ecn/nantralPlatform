import { Link } from 'react-router-dom';

import { ChevronRight } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getGroupListApi } from '#modules/group/api/getGroupList.api';
import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { Section } from '#shared/components/Section/Section';
import { useTranslation } from '#shared/i18n/useTranslation';

export function MyGroupsSection() {
  const { t } = useTranslation();
  const { data, isPending } = useQuery({
    queryFn: () => getGroupListApi({ isMember: true }),
    queryKey: ['group', { isMember: true }],
  });

  return (
    <Section
      title={t('home.myGroupSection.title')}
      button={
        <Button
          component={Link}
          to="/group"
          variant="outlined"
          color="secondary"
          endIcon={<ChevronRight />}
        >
          {t('home.myGroupSection.seeAll')}
        </Button>
      }
    >
      {!isPending && data?.count === 0 ? (
        <Typography>{t('home.myGroupSection.noGroup')}</Typography>
      ) : (
        <GroupGrid
          estimatedSize={6}
          groups={data?.results ?? []}
          isPending={isPending}
        />
      )}
    </Section>
  );
}
