import { Skeleton, Typography } from '@mui/material';

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
  if (slug !== undefined) {
    infos.push(`@${slug}`);
  }
  if (memberCount !== undefined) {
    infos.push(`${memberCount} membre(s)`);
  }
  if (eventCount !== undefined) {
    infos.push(`${eventCount} événement(s)`);
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
