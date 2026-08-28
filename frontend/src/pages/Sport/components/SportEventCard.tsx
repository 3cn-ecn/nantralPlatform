import { useState } from 'react';

import {
  CalendarMonth,
  QueryBuilder,
  Edit,
  Groups,
  LocationOn,
  People,
  PersonOff,
} from '@mui/icons-material';
import {
  alpha,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import { SportEvent, SportEventType } from '#modules/event/sportevent.type';
import { EditSportEventModal } from '#modules/event/view/Modals/EditSportEventModal';
import { SportEventPeopleModal } from '#modules/event/view/SportEventPeopleModal';
import { useGroupDetailsQuery } from '#modules/group/hooks/useGroupDetails.query';
import { useSportEventParticipationMutation } from '#pages/Sport/hooks/useSportEventParticipationMutation';
import { Avatar as GroupAvatar } from '#shared/components/Avatar/Avatar';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

interface SportEventCardProps {
  sportEvent: SportEvent;
}

export function SportEventCard({ sportEvent }: Readonly<SportEventCardProps>) {
  const { formatDate } = useTranslation();
  const theme = useTheme();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenPeopleModal, setIsOpenPeopleModal] = useState(false);

  const { group } = useGroupDetailsQuery(sportEvent.group.slug);
  const isAdmin = group?.isAdmin ?? false;
  const isMember = group?.isMember ?? false;

  const participationMutation = useSportEventParticipationMutation(
    sportEvent.id,
    sportEvent.isParticipating,
  );

  const eventDate = formatDate(sportEvent.date, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const participationLabel =
    sportEvent.isParticipating === true
      ? 'Tu participes'
      : sportEvent.isParticipating === false
        ? 'Tu ne participes pas'
        : null;

  const hasDescription = Boolean(sportEvent.description?.trim());

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          height: '100%',
          maxWidth: '250px',
          maxHeight: '250px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <CardContent sx={{ pt: 2.25, pb: 1.75 }}>
          <FlexRow
            alignItems="flex-start"
            justifyContent="space-between"
            gap={1}
          >
            <FlexRow
              alignItems="center"
              justifyContent="space-between"
              gap={1}
            >
              <GroupAvatar
                alt={sportEvent.group.name}
                src={sportEvent.group.icon}
                size="m"
              />
              <FlexCol>
                <Typography variant="subtitle1" fontWeight={800} noWrap>
                  {sportEvent.group.name}
                </Typography>
                <Chip
                  label={SportEventType.toString(sportEvent.type)}
                  variant="outlined"
                  color="info"
                  size="small"
                />
              </FlexCol>
            </FlexRow>

            {isAdmin && (
              <Tooltip title="Modifier">
                <IconButton
                  size="small"
                  onClick={() => setIsOpenEditModal(true)}
                  sx={{
                    mt: -0.5,
                    mr: -0.5,
                    flexShrink: 0,
                    bgcolor: alpha(theme.palette.background.paper, 0.28),
                    border: `1px solid ${alpha(
                      theme.palette.common.white,
                      0.08,
                    )}`,
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </FlexRow>
          <FlexRow gap={0.5} alignItems="center" marginTop={1}>
            <CalendarMonth sx={{ fontSize: 16 }} />
            <Typography>{eventDate}</Typography>
          </FlexRow>
          <FlexRow gap={0.5} alignItems="center">
            <QueryBuilder sx={{ fontSize: 16 }} />
            <Typography>{sportEvent.date.toLocaleTimeString()}</Typography>
          </FlexRow>
          <FlexRow gap={0.5} alignItems="center">
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography>{sportEvent.location}</Typography>
          </FlexRow>
          <Typography
            variant="body2"
            sx={{
              mt: 1.75,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 4,
              overflow: 'hidden',
              color: hasDescription ? 'text.secondary' : 'text.disabled',
              fontStyle: hasDescription ? 'normal' : 'italic',
              lineHeight: 1.5,
            }}
          >
            {hasDescription ? sportEvent.description : 'Aucune description'}
          </Typography>
        </CardContent>

        <Divider />

        <CardActions
          sx={{
            px: 2,
            py: 1.25,
            gap: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <FlexRow gap={1} alignItems="center" flexWrap="wrap">
            <Button
              size="small"
              variant="text"
              startIcon={<Groups fontSize="small" />}
              onClick={() => setIsOpenPeopleModal(true)}
              sx={{ fontWeight: 700, px: 1 }}
            >
              {sportEvent.participantsCount} participant
              {sportEvent.participantsCount > 1 ? 's' : ''}
            </Button>

            {participationLabel && (
              <Chip
                size="small"
                icon={
                  sportEvent.isParticipating ? (
                    <People sx={{ fontSize: 16 }} />
                  ) : (
                    <PersonOff sx={{ fontSize: 16 }} />
                  )
                }
                label={participationLabel}
                color={sportEvent.isParticipating ? 'success' : 'default'}
                variant={sportEvent.isParticipating ? 'filled' : 'outlined'}
                sx={{
                  borderRadius: 999,
                  fontWeight: 600,
                  ...(sportEvent.isParticipating && {
                    bgcolor: alpha(theme.palette.success.main, 0.16),
                    color: theme.palette.success.main,
                  }),
                }}
              />
            )}
          </FlexRow>

          {isMember && (
            <FlexRow gap={0.75} flexWrap="wrap" justifyContent="flex-end">
              <LoadingButton
                size="small"
                variant={
                  sportEvent.isParticipating === true ? 'contained' : 'outlined'
                }
                loading={
                  participationMutation.isLoading &&
                  participationMutation.variables === 'participant'
                }
                onClick={() => participationMutation.mutate('participant')}
              >
                Participer
              </LoadingButton>
              <LoadingButton
                size="small"
                variant={
                  sportEvent.isParticipating === false
                    ? 'contained'
                    : 'outlined'
                }
                loading={
                  participationMutation.isLoading &&
                  participationMutation.variables === 'nonParticipant'
                }
                onClick={() => participationMutation.mutate('nonParticipant')}
              >
                Non-participant
              </LoadingButton>
            </FlexRow>
          )}
        </CardActions>
      </Card>

      {isOpenEditModal && (
        <EditSportEventModal
          sportEventId={sportEvent.id}
          onClose={() => setIsOpenEditModal(false)}
        />
      )}

      {isOpenPeopleModal && (
        <SportEventPeopleModal
          sportEvent={sportEvent}
          onClose={() => setIsOpenPeopleModal(false)}
        />
      )}
    </>
  );
}
