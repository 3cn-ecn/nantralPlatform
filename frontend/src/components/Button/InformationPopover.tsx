import * as React from 'react';
import { Box, Chip, Popover, Typography } from '@mui/material';
import {
  DateRange,
  AccessTime as ClockIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

export function EventPopover(props: {
  anchorRef: any;
  open: boolean;
  beginInscription;
  maxParticipant;
  onClose: () => void;
}) {
  const { anchorRef, open, onClose, beginInscription, maxParticipant } = props;
  const { t, i18n } = useTranslation('translation');
  return (
    <Popover
      id="id"
      anchorEl={anchorRef.current}
      open={open}
      onClose={() => onClose()}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Typography marginBottom={1}>{t('event.shotgunDatails')}</Typography>
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 1, rowGap: 1 }}
        >
          <Chip
            avatar={<DateRange />}
            label={`${new Date(beginInscription).toLocaleDateString(
              i18n.language,
              {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              }
            )}`}
          />
          <Chip
            avatar={<ClockIcon />}
            label={`${new Date(beginInscription).toLocaleTimeString(
              i18n.language,
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )}`}
          />
          <Chip avatar={<PeopleIcon />} label={maxParticipant} />
        </Box>
      </Box>
    </Popover>
  );
}

export function TextPopover(props: {
  anchorRef: any;
  open: boolean;
  onClose: () => void;
  children;
}) {
  const { anchorRef, open, onClose, children } = props;
  return (
    <Popover
      id="id"
      anchorEl={anchorRef.current}
      open={open}
      onClose={() => onClose()}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Box sx={{ padding: 2 }}>{children}</Box>
    </Popover>
  );
}
