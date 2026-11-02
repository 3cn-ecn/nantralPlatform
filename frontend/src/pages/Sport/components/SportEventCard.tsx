import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  CalendarMonth,
  Edit,
  Groups,
  LocationOn,
  QueryBuilder,
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
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import {
  SportEvent,
  SportEventType,
  sportEventTypeToString,
} from '#modules/event/sportevent.type';
import { EditSportEventModal } from '#modules/event/view/Modals/EditSportEventModal';
import { SportEventPeopleModal } from '#modules/event/view/SportEventPeopleModal';
import { useSportEventParticipationMutation } from '#pages/Sport/hooks/useSportEventParticipationMutation';
import { Avatar as GroupAvatar } from '#shared/components/Avatar/Avatar';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { RichTextRenderer } from '#shared/components/RichTextRenderer/RichTextRenderer';
import { useTranslation } from '#shared/i18n/useTranslation';

interface SportEventCardProps {
  sportEvent: SportEvent;
}

export function SportEventCard({ sportEvent }: Readonly<SportEventCardProps>) {
  const { t, formatDate, formatTime } = useTranslation();
  const theme = useTheme();
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenPeopleModal, setIsOpenPeopleModal] = useState(false);

  const isAdmin = sportEvent.canEdit;
  const isMember = sportEvent.isGroupMember;
  // only members and admins of the group can see who participates
  const canSeePeople = isAdmin || isMember;

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

  const hasDescription = Boolean(sportEvent.description?.trim());

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          maxWidth: '250px',
          height: '270px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <CardContent
          sx={{
            pt: 2.25,
            pb: 1.75,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
            spacing={1}
          >
            <Stack
              direction="row"
              component={Link}
              to={sportEvent.group.url}
              spacing={1}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                minWidth: 0,
                alignItems: 'center',
              }}
            >
              <GroupAvatar
                alt={sportEvent.group.name}
                src={sportEvent.group.icon}
                size="m"
              />
              <Stack sx={{ alignItems: 'flex-start', minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  title={sportEvent.group.shortName}
                  sx={{
                    fontWeight: 800,
                    maxWidth: '100%',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {sportEvent.group.name}
                </Typography>
                <Chip
                  label={sportEventTypeToString(sportEvent.type)}
                  variant="outlined"
                  color={
                    sportEvent.type === SportEventType.TRAINING
                      ? 'info'
                      : 'warning'
                  }
                  size="small"
                />
              </Stack>
            </Stack>

            {isAdmin && (
              <Tooltip title={t('button.edit')}>
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
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', marginTop: 1 }}
          >
            <CalendarMonth sx={{ fontSize: 16 }} />
            <Typography>{eventDate}</Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', marginTop: 1 }}
          >
            <QueryBuilder sx={{ fontSize: 16 }} />
            <Typography>{formatTime(sportEvent.date)}</Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ alignItems: 'center', marginTop: 1 }}
          >
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography>{sportEvent.location}</Typography>
          </Stack>
          <RichTextRenderer
            content={sportEvent.description || t('sport.noDescription')}
            sx={{
              mt: 0.5,
              pt: 0,
              '& > :first-child': { mt: 0 },
              '& p': { my: 0 },
              // show at most 2 lines, with an ellipsis
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flexShrink: 0,
              color: hasDescription ? 'text.secondary' : 'text.disabled',
              fontStyle: hasDescription ? 'normal' : 'italic',
              lineHeight: 1.5,
              fontSize: (theme) => theme.typography.body2.fontSize,
            }}
          />
        </CardContent>

        {canSeePeople && (
          <>
            <Divider />

            <CardActions
              sx={{
                px: 2,
                py: 1.25,
                gap: 1,
                display: 'flex',
                flexShrink: 0,
                flexDirection: 'column',
                alignItems: 'stretch',
                flexWrap: 'nowrap',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap', width: '100%' }}
              >
                <Button
                  size="small"
                  variant="text"
                  startIcon={<Groups fontSize="small" />}
                  onClick={() => setIsOpenPeopleModal(true)}
                  sx={{ fontWeight: 700, px: 1 }}
                >
                  {t('sport.participants', {
                    count: sportEvent.participantsCount,
                  })}
                </Button>
              </Stack>

              {isMember && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Typography variant="body2" noWrap>
                    {t('sport.actions.question')}
                  </Typography>
                  <LoadingButton
                    size="small"
                    variant={
                      sportEvent.isParticipating === true
                        ? 'contained'
                        : 'outlined'
                    }
                    loading={
                      participationMutation.isPending &&
                      participationMutation.variables === 'participant'
                    }
                    onClick={() => participationMutation.mutate('participant')}
                  >
                    {t('sport.actions.yes')}
                  </LoadingButton>
                  <LoadingButton
                    size="small"
                    variant={
                      sportEvent.isParticipating === false
                        ? 'contained'
                        : 'outlined'
                    }
                    loading={
                      participationMutation.isPending &&
                      participationMutation.variables === 'nonParticipant'
                    }
                    onClick={() =>
                      participationMutation.mutate('nonParticipant')
                    }
                  >
                    {t('sport.actions.no')}
                  </LoadingButton>
                </Stack>
              )}
            </CardActions>
          </>
        )}
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
