import { Link } from 'react-router-dom';

import {
  Event as EventIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { differenceInHours, differenceInMonths } from 'date-fns';

import { EventPreview } from '#modules/event/event.type';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

import { BookmarkedButton } from '../shared/BookmarkedButton';
import { MoreEventActionsButton } from '../shared/MoreEventActionsButton';
import { ParticipateButton } from '../shared/ParticipateButton';

const DEFAULT_EVENT_IMAGE = '/static/img/default-banner.png';

interface EventCardProps {
  event: EventPreview;
}

export function EventCard({ event }: EventCardProps) {
  const { formatDate, formatTime, formatDateTimeRange } = useTranslation();
  const formatDateOptions: Intl.DateTimeFormatOptions =
    Math.abs(differenceInMonths(event.startDate, new Date())) > 2
      ? { dateStyle: 'short' }
      : { weekday: 'short', day: 'numeric', month: 'long' };
  const isLongerThanADay =
    Math.abs(differenceInHours(event.startDate, event.endDate)) > 24;

  return (
    <Card>
      <CardActionArea component={Link} to={`/event/${event.id}`}>
        <CardMedia
          component="img"
          src={event.image || DEFAULT_EVENT_IMAGE}
          loading="lazy"
          alt=""
          height={140}
        />
        <CardContent sx={{ pb: 1 }}>
          <FlexRow gap={1} alignItems="center">
            <Avatar alt={event.group.shortName} src={event.group.icon} />
            <FlexCol>
              <Typography variant="h6" lineHeight={1} mb="4px" noWrap>
                {event.title}
              </Typography>
              <Typography variant="caption" lineHeight={1} noWrap>
                {event.group.name}
              </Typography>
            </FlexCol>
          </FlexRow>
          <FlexRow mt={2} gap={2} flexWrap="wrap">
            <FlexRow gap={1} alignItems="center">
              <EventIcon />
              <Typography variant="body2">
                {isLongerThanADay
                  ? formatDateTimeRange(
                      event.startDate,
                      event.endDate,
                      formatDateOptions,
                    )
                  : formatDate(event.startDate, formatDateOptions)}
              </Typography>
            </FlexRow>
            {!isLongerThanADay && (
              <FlexRow gap={1} alignItems="center">
                <ScheduleIcon />
                <Typography variant="body2">
                  {formatTime(event.startDate)}
                </Typography>
              </FlexRow>
            )}
          </FlexRow>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing>
        <ParticipateButton event={event} sx={{ width: '100%', mr: 1 }} />
        <BookmarkedButton eventId={event.id} selected={event.isBookmarked} />
        <MoreEventActionsButton
          isAdmin={event.group.isAdmin}
          sharedUrl={`${window.location.origin}/event/${event.id}`}
          eventId={event.id}
          isParticipating={event.isParticipating}
        />
      </CardActions>
    </Card>
  );
}
