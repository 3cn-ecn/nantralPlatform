import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Event as EventIcon } from '@mui/icons-material';
import { Button, ListItemText, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as CalendarLink from 'calendar-link';

import { Event } from '#modules/event/event.type';
import { useTranslation } from '#shared/i18n/useTranslation';

interface AddToCalendarButtonProps {
  event: Event;
}

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const anchorEl = useRef<HTMLButtonElement | null>(null);

  const onButtonClick = () => {
    setIsMenuOpen((v) => !v);
  };

  const handleClose = () => {
    setIsMenuOpen(false);
  };

  const eventInfo: CalendarLink.CalendarEvent = {
    title: event.title,
    start: event.startDate.toUTCString(),
    end: event.endDate.toUTCString(),
    location: event.location,
    url: location.origin + event.url,
    description: event.description,
  };

  return (
    <>
      <Button
        ref={anchorEl}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        disableElevation
        onClick={onButtonClick}
        startIcon={<EventIcon />}
        variant="outlined"
        color="secondary"
      >
        {t('event.action_menu.addToCalendar')}
      </Button>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            style: {
              marginTop: theme.spacing(1),
              borderRadius: 6,
              padding: '4px 0',
              minWidth: anchorEl.current?.clientWidth ?? undefined,
            },
          },
        }}
        anchorEl={anchorEl.current}
        open={isMenuOpen}
        onClose={handleClose}
      >
        <MenuItem
          component={Link}
          to={CalendarLink.google(eventInfo)}
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText>Google Calendar</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to={CalendarLink.outlook(eventInfo)}
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText>Outlook</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to={CalendarLink.office365(eventInfo)}
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText>Office 365</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to={CalendarLink.yahoo(eventInfo)}
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText>Yahoo Calendar</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to={CalendarLink.msTeams(eventInfo)}
          onClick={handleClose}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemText>Microsoft Teams</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
