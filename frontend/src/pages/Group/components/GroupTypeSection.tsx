import { useSearchParams } from 'react-router-dom';

import { ChevronRight } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { useTranslation } from '#shared/i18n/useTranslation';
import { Page } from '#shared/infra/pagination';

import { MoreGroupButton } from './MoreGroupButton';

interface GroupTypeSectionProps {
  type: GroupTypePreview;
  groups?: Page<GroupPreview>;
  isPending: boolean;
  pageSize: number;
}

export function GroupTypeSection({
  type,
  isPending,
  groups,
  pageSize,
}: GroupTypeSectionProps) {
  const { t } = useTranslation();
  const [, setParams] = useSearchParams();
  const count = groups?.count ?? -1;
  return (
    <Stack key={type.slug} sx={{ justifyContent: 'flex-start' }}>
      <Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
        <Typography variant="h2">{type.name}</Typography>
        <Button
          onClick={() => setParams({ type: type.slug })}
          variant="outlined"
          endIcon={<ChevronRight />}
        >
          {t('group.type.seeAll')}
        </Button>
      </Stack>

      {count === 0 && (
        <Typography sx={{ mb: 3 }}>{t('group.list.noGroup')}</Typography>
      )}
      <GroupGrid
        estimatedSize={6}
        isPending={isPending}
        groups={groups?.results?.slice(
          0,
          count > pageSize ? pageSize - 1 : pageSize,
        )}
        extraComponent={
          count > pageSize ? (
            <MoreGroupButton
              count={count - pageSize}
              onClick={() => setParams({ type: type.slug })}
            />
          ) : undefined
        }
      />
    </Stack>
  );
}
