import { useSearchParams } from 'react-router-dom';

import { ChevronRight } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';

import { GroupPreview } from '#modules/group/types/group.types';
import { GroupTypePreview } from '#modules/group/types/groupType.types';
import { GroupGrid } from '#modules/group/view/GroupGrid/GroupGrid';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
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

      {count === 0 && <Typography mb={3}>{t('group.list.noGroup')}</Typography>}
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
    </FlexCol>
  );
}
