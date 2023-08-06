import { useLocation, useNavigate } from 'react-router';

import {
  CalendarMonth as CalendarIcon,
  GridView as GridIcon,
} from '@mui/icons-material';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';
import { useBreakpoint } from '#shared/utils/useBreakpoint';

export function ToggleEventViewButton() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const bk = useBreakpoint(500);

  return (
    <FlexCol justifyContent="center">
      <ToggleButtonGroup
        size={bk.isSmaller ? 'medium' : 'small'}
        exclusive
        color="primary"
        value={pathname.endsWith('/') ? pathname.slice(0, -1) : pathname}
        onChange={(e, path) => navigate(path)}
      >
        <ToggleButton value="/event" sx={{ gap: 1, pl: 2, pr: 1.5 }}>
          <GridIcon fontSize="small" />
          {bk.isLarger && t('event.grid.label')}
        </ToggleButton>
        <ToggleButton value="/event/calendar" sx={{ gap: 1, pr: 2, pl: 1.5 }}>
          <CalendarIcon fontSize="small" />
          {bk.isLarger && t('event.calendar.label')}
        </ToggleButton>
      </ToggleButtonGroup>
    </FlexCol>
  );
}
