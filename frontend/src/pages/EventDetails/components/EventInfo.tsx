import { Link } from 'react-router-dom';

import {
  Event as EventIcon,
  Place as PlaceIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/material';
import { isSameDay as dateFnsIsSameDay, differenceInMonths } from 'date-fns';

import { Event } from '#modules/event/event.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
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
  const { t, formatDate, formatDateTimeRange } = useTranslation();
  const bk = useBreakpoint('md');

  const isSameDay = dateFnsIsSameDay(endDate, startDate);

  const isLessThanTwoMonthsFromNow =
    Math.abs(differenceInMonths(startDate, Date.now())) <= 2;

  const formatDateOptions: Intl.DateTimeFormatOptions =
    isLessThanTwoMonthsFromNow
      ? { weekday: 'short', day: 'numeric', month: 'long' }
      : { dateStyle: 'long' };

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
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 2, sm: 5 }}
      sx={{ alignItems: 'center', flexWrap: 'wrap' }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <IconButton component={Link} to={group.url} sx={{ p: 0.5 }}>
          <Avatar
            src={group.icon}
            alt={group.shortName}
            size={bk.isLarger ? 'l' : 'm'}
          />
        </IconButton>
        <Typography>{group.name}</Typography>
      </Stack>
      {!!location && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <PlaceIcon titleAccess={t('event.details.place.label')} id="place" />
          <Typography aria-labelledby="place">{location}</Typography>
        </Stack>
      )}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <EventIcon titleAccess={t('event.details.day.label')} id="date" />
        <Typography aria-labelledby="date">
          {isSameDay
            ? formatDate(startDate, formatDateOptions)
            : formatDateTimeRange(startDate, endDate, formatDateTimeOptions)}
        </Typography>
      </Stack>
      {isSameDay && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <ScheduleIcon titleAccess={t('event.details.time.label')} id="time" />
          <Typography aria-labelledby="time">
            {formatDateTimeRange(startDate, endDate, { timeStyle: 'short' })}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
