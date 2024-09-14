import { useRef, useState } from 'react';

import { Event as EventIcon } from '@mui/icons-material';
import { Button, Link } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
    url: `${window.location.origin}/event/${event.id}`,
    description: [
      event.description,
      event.descriptionTranslated.en,
      event.descriptionTranslated.fr,
    ]
      .filter((x) => !!x) // Remove empty descriptions
      .join('\n\n'), // Add two empty lines in between
  };

  const linkButtonsProps = [
    { title: 'Google Calendar', href: CalendarLink.google(eventInfo) },
    { title: 'Outlook', href: CalendarLink.outlook(eventInfo) },
    { title: 'Office 365', href: CalendarLink.office365(eventInfo) },
    { title: 'Yahoo Calendar', href: CalendarLink.yahoo(eventInfo) },
    { title: 'Microsoft Teams', href: CalendarLink.msTeams(eventInfo) },
  ];

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
        {linkButtonsProps.map((props) => (
          <Link
            underline="none"
            color="inherit"
            href={props.href}
            onClick={handleClose}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MenuItem>{props.title}</MenuItem>
          </Link>
        ))}
      </Menu>
    </>
  );
}
