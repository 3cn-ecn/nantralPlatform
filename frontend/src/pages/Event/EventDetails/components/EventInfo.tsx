import { Link } from 'react-router-dom';

import {
  Event as EventIcon,
  Place as PlaceIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { Typography } from '@mui/material';
import { isSameDay as dateFnsIsSameDay, differenceInMonths } from 'date-fns';

import { Event } from '#modules/event/event.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

type EventInfoProps = Pick<
  Event,
  'startDate' | 'endDate' | 'group' | 'location'
>;

export function EventInfo({
  startDate,
  endDate,
  group,
  location,
}: EventInfoProps) {
  const { formatDate, formatDateTimeRange } = useTranslation();

  const isSameDay = dateFnsIsSameDay(endDate, startDate);

  const isLessThanTwoMonthsFromNow =
    Math.abs(differenceInMonths(startDate, Date.now())) <= 2;

  const formatDateOptions: Intl.DateTimeFormatOptions =
    isLessThanTwoMonthsFromNow
      ? { weekday: 'short', day: 'numeric', month: 'long' }
      : { dateStyle: 'short' };

  const formatDateTimeOptions: Intl.DateTimeFormatOptions =
    isLessThanTwoMonthsFromNow
      ? {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }
      : { dateStyle: 'long', timeStyle: 'short' };

  return (
    <FlexRow columnGap={5} rowGap={2} alignItems="center" flexWrap="wrap">
      <FlexRow gap={1} alignItems="center">
        <Avatar
          src={group.icon}
          alt={group.shortName}
          component={Link}
          to={group.url}
          reloadDocument
        />
        <Typography>{group.name}</Typography>
      </FlexRow>
      <FlexRow gap={1} alignItems="center">
        <PlaceIcon />
        <Typography>{location}</Typography>
      </FlexRow>
      <FlexRow gap={1} alignItems="center">
        <EventIcon />
        <Typography>
          {isSameDay
            ? formatDate(startDate, formatDateOptions)
            : formatDateTimeRange(startDate, endDate, formatDateTimeOptions)}
        </Typography>
      </FlexRow>
      {isSameDay && (
        <FlexRow gap={1} alignItems="center">
          <ScheduleIcon />
          <Typography>
            {formatDateTimeRange(startDate, endDate, {
              timeStyle: 'short',
            })}
          </Typography>
        </FlexRow>
      )}
    </FlexRow>
  );
}
