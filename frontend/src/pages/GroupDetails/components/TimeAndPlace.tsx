import { AccessTimeFilled, Place } from '@mui/icons-material';
import { Chip } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';

interface TimeAndPlaceProps {
  time?: string;
  place?: string;
}

export function TimeAndPlace({ time, place }: TimeAndPlaceProps) {
  return (
    <FlexRow columnGap={1} rowGap={1} mr={2} flexWrap={'wrap'}>
      {place && (
        <Chip sx={{ mt: 1 }} label={place} icon={<Place color="primary" />} />
      )}
      {time && (
        <Chip
          sx={{ mt: 1 }}
          label={time}
          icon={<AccessTimeFilled color="primary" />}
        />
      )}
    </FlexRow>
  );
}
