import {
  AccessTime as AccessTimeIcon,
  PlaceOutlined as PlaceIcon,
} from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

interface TimeAndPlaceProps {
  time?: string;
  place?: string;
}

export function TimeAndPlace({ time, place }: TimeAndPlaceProps) {
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      sx={{ columnGap: 3, rowGap: '3px', flexWrap: 'wrap', mt: 1, ml: '-3px' }}
    >
      {place && (
        <Stack
          direction="row"
          spacing="3.5px"
          sx={{ flexWrap: 'nowrap', alignItems: 'center' }}
        >
          <PlaceIcon
            color="secondary"
            titleAccess={t('group.form.meetingPlace.label')}
          />
          <Typography
            color="secondary"
            variant="subtitle2"
            component="p"
            sx={{ lineHeight: 1.3 }}
          >
            {place}
          </Typography>
        </Stack>
      )}
      {time && (
        <Stack
          direction="row"
          sx={{ flexWrap: 'nowrap', alignItems: 'center' }}
          spacing="3.5px"
        >
          <AccessTimeIcon
            color="secondary"
            titleAccess={t('group.form.meetingHour.label')}
          />
          <Typography
            color="secondary"
            variant="subtitle2"
            component="p"
            sx={{ lineHeight: 1.3 }}
          >
            {time}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
