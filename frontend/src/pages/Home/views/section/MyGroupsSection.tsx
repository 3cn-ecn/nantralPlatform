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
  const { data, isLoading } = useQuery({
    queryFn: () => getGroupListApi({ isMember: true }),
    queryKey: ['group', { isMember: true }],
  });

  return (
    <Section
      title={t('home.myGroupSection.title')}
      button={
        <Button
          component={Link}
          to="/me/"
          reloadDocument
          variant="outlined"
          color="secondary"
          endIcon={<ChevronRight />}
        >
          {t('home.myGroupSection.seeAll')}
        </Button>
      }
    >
      {!isLoading && data?.count === 0 ? (
        <Typography>
          Vous n&apos;êtes dans aucun groupe actuellement 😔
        </Typography>
      ) : (
        <GroupGrid
          estimatedSize={6}
          groups={data?.results ?? []}
          isLoading={isLoading}
        />
      )}
    </Section>
  );
}
