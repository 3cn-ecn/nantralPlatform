import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Event as EventIcon } from '@mui/icons-material';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import * as CalendarLink from 'calendar-link';

import { Event } from '#modules/event/event.type';
import { useTranslation } from '#shared/i18n/useTranslation';

interface AddToCalendarButtonProps {
  event: Event;
}

export function AddToCalendarButton({ event }: AddToCalendarButtonProps) {
  const { t } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const onButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
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
      <MenuItem
        role="button"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        onClick={onButtonClick}
      >
        <ListItemIcon>
          <EventIcon />
        </ListItemIcon>
        <ListItemText>{t('event.action_menu.addToCalendar')}</ListItemText>
      </MenuItem>
      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={anchorEl}
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
