import { Skeleton, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

interface GroupInfoLineProps {
  isLoading: boolean;
  memberCount?: number;
  eventCount?: number;
  slug?: string;
}

export function GroupInfoLine({
  isLoading,
  memberCount,
  eventCount,
  slug,
}: GroupInfoLineProps) {
  const infos: string[] = [];
  const { t } = useTranslation();
  if (slug !== undefined) {
    infos.push(`@${slug}`);
  }
  if (memberCount !== undefined) {
    infos.push(`${memberCount} ${t('group.details.infoLine.members')}`);
  }
  if (eventCount !== undefined) {
    infos.push(`${eventCount} ${t('group.details.infoLine.events')}`);
  }
  return (
    <Typography color="gray" variant="subtitle1">
      {isLoading ? (
        <Skeleton animation="wave" width={200} />
      ) : (
        infos.join(' • ')
      )}
    </Typography>
  );
}
