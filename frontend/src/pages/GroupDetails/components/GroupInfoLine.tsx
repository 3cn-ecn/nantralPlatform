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
    infos.push(t('group.details.infoLine.members', { count: memberCount }));
  }
  if (eventCount !== undefined) {
    infos.push(t('group.details.infoLine.events', { count: eventCount }));
  }

  return (
    <Typography color="textSecondary" variant="body2" mt="1px">
      {isLoading ? (
        <Skeleton animation="wave" width={200} />
      ) : (
        infos.join(' • ')
      )}
    </Typography>
  );
}
