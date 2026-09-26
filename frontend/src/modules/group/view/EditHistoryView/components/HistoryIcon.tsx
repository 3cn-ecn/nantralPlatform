import {
  AddCircleOutline,
  HelpOutline,
  HighlightOff,
  Update,
} from '@mui/icons-material';
import { Avatar, useTheme } from '@mui/material';

import { GroupHistory } from '#modules/group/types/groupHistory.type';

export function HistoryIcon({
  historyType,
}: {
  historyType: GroupHistory['historyType'];
}) {
  const { palette } = useTheme();

  switch (historyType) {
    case '-':
      return (
        <Avatar
          sx={{ backgroundColor: palette.error.main }}
          alt={'Group deleted'}
        >
          <HighlightOff />
        </Avatar>
      );
    case '~':
      return (
        <Avatar
          sx={{ backgroundColor: palette.info.main }}
          alt={'Group updated'}
        >
          <Update />
        </Avatar>
      );
    case '+':
      return (
        <Avatar
          sx={{ backgroundColor: palette.success.main }}
          alt={'Group created'}
        >
          <AddCircleOutline />
        </Avatar>
      );
    default:
      return (
        <Avatar
          sx={{ backgroundColor: palette.secondary.main }}
          alt={'Unknown change type'}
        >
          <HelpOutline />
        </Avatar>
      );
  }
}
