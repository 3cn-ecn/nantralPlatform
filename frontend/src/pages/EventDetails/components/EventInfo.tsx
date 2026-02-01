import { Link } from 'react-router-dom';

import {
  Event as EventIcon,
  Place as PlaceIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { differenceInMonths, isSameDay as dateFnsIsSameDay } from 'date-fns';

import { Event } from '#modules/event/event.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexAuto, FlexRow } from '#shared/components/FlexBox/FlexBox';
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
    Math.abs(differenceInMonths(startDate, new Date())) <= 2;

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
    <FlexAuto
      breakPoint="sm"
      columnGap={5}
      rowGap={2}
      alignItems="center"
      flexWrap="wrap"
    >
      <FlexRow gap={1} alignItems="center">
        <IconButton component={Link} to={group.url} sx={{ p: 0.5 }}>
          <Avatar
            src={group.icon}
            alt={group.shortName}
            size={bk.isLarger ? 'l' : 'm'}
          />
        </IconButton>
        <Typography>{group.name}</Typography>
      </FlexRow>
      {!!location && (
        <FlexRow gap={1} alignItems="center">
          <PlaceIcon titleAccess={t('event.details.place.label')} id="place" />
          <Typography aria-labelledby="place">{location}</Typography>
        </FlexRow>
      )}
      <FlexRow gap={1} alignItems="center">
        <EventIcon titleAccess={t('event.details.day.label')} id="date" />
        <Typography aria-labelledby="date">
          {isSameDay
            ? formatDate(startDate, formatDateOptions)
            : formatDateTimeRange(startDate, endDate, formatDateTimeOptions)}
        </Typography>
      </FlexRow>
      {isSameDay && (
        <FlexRow gap={1} alignItems="center">
          <ScheduleIcon titleAccess={t('event.details.time.label')} id="time" />
          <Typography aria-labelledby="time">
            {formatDateTimeRange(startDate, endDate, { timeStyle: 'short' })}
          </Typography>
        </FlexRow>
      )}
    </FlexAuto>
  );
}
