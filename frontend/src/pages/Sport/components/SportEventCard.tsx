import { useState } from 'react';

import {
  CalendarMonth,
  QueryBuilder,
  Edit,
  Groups,
  LocationOn,
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

  let participationLabel = null;
  if (sportEvent.isParticipating === true) {
    participationLabel = t('sport.participation.participating');
  } else if (sportEvent.isParticipating === false) {
    participationLabel = t('sport.participation.notParticipating');
  }

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
          <FlexRow
            alignItems="flex-start"
            justifyContent="space-between"
            gap={1}
          >
            <FlexRow alignItems="center" justifyContent="space-between" gap={1}>
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
          </FlexRow>
          <FlexRow gap={0.5} alignItems="center" marginTop={1}>
            <CalendarMonth sx={{ fontSize: 16 }} />
            <Typography>{eventDate}</Typography>
          </FlexRow>
          <FlexRow gap={0.5} alignItems="center">
            <QueryBuilder sx={{ fontSize: 16 }} />
            <Typography>{formatTime(sportEvent.date)}</Typography>
          </FlexRow>
          <FlexRow gap={0.5} alignItems="center">
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography>{sportEvent.location}</Typography>
          </FlexRow>
          <Typography
            variant="body2"
            sx={{
              mt: 0,
              pt: 0,
              color: hasDescription ? 'text.secondary' : 'text.disabled',
              fontStyle: hasDescription ? 'normal' : 'italic',
              lineHeight: 1.5,
            }}
          >
            <RichTextRenderer
              content={sportEvent.description || t('sport.noDescription')}
            />
          </Typography>
        </CardContent>

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
          <FlexRow gap={1} alignItems="center" flexWrap="wrap" width="100%">
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
          </FlexRow>

          {isMember && (
            <FlexRow
              gap={0.75}
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Typography variant="body2" noWrap>
                {t('sport.actions.question')}
              </Typography>
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
                  participationMutation.isLoading &&
                  participationMutation.variables === 'nonParticipant'
                }
                onClick={() => participationMutation.mutate('nonParticipant')}
              >
                {t('sport.actions.no')}
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
