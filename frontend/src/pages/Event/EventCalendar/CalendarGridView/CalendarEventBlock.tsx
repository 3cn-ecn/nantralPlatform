import { Link } from 'react-router-dom';

import { ButtonBase, Typography, useTheme } from '@mui/material';

import { EventPreview } from '#modules/event/event.type';
import { stringToColor } from '#shared/utils/stringToColor';

type CalendarEventBlockProps = {
  eventItem: EventPreview;
};

export function CalendarEventBlock({ eventItem }: CalendarEventBlockProps) {
  const theme = useTheme();

  return (
    <ButtonBase
      component={Link}
      to={eventItem.url}
      focusRipple
      sx={{
        backgroundColor: stringToColor(eventItem.title),
        backgroundImage: `url(${eventItem.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '20px',
        overflow: 'hidden',
        maxWidth: '95%',
        mb: 0.25,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          backdropFilter: 'blur(5px)',
          backgroundColor:
            theme.palette.mode === 'light' ? '#FFFFFF90' : '#00000050',
          padding: '0.3rem 0.7rem',
          width: '100%',
          height: '100%',
        }}
        textAlign="center"
        noWrap
      >
        {eventItem.title}
      </Typography>
    </ButtonBase>
  );
}
