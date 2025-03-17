import {
  AccessTime as AccessTimeIcon,
  PlaceOutlined as PlaceIcon,
} from '@mui/icons-material';
import { Typography } from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

interface TimeAndPlaceProps {
  time?: string;
  place?: string;
}

export function TimeAndPlace({ time, place }: TimeAndPlaceProps) {
  const { t } = useTranslation();
  return (
    <FlexRow columnGap={3} rowGap="3px" flexWrap={'wrap'} mt={1} ml="-3px">
      {place && (
        <FlexRow flexWrap="nowrap" alignItems="center" gap="3.5px">
          <PlaceIcon
            color="secondary"
            titleAccess={t('group.form.meetingPlace.label')}
          />
          <Typography
            color="secondary"
            variant="subtitle2"
            component="p"
            lineHeight={1.3}
          >
            {place}
          </Typography>
        </FlexRow>
      )}
      {time && (
        <FlexRow flexWrap="nowrap" alignItems="center" gap="3.5px">
          <AccessTimeIcon
            color="secondary"
            titleAccess={t('group.form.meetingHour.label')}
          />
          <Typography
            color="secondary"
            variant="subtitle2"
            component="p"
            lineHeight={1.3}
          >
            {time}
          </Typography>
        </FlexRow>
      )}
    </FlexRow>
  );
}
