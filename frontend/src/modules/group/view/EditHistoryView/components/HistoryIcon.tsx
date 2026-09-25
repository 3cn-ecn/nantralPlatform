import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UpdateIcon from '@mui/icons-material/Update';
import { Avatar, useTheme } from '@mui/material';

import { GroupHistory } from '#modules/group/types/groupHistory.type';

export function HistoryIcon({ type }: { type: GroupHistory['historyType'] }) {
  const { palette } = useTheme();

  if (type === '-')
    return (
      <Avatar
        sx={{ backgroundColor: palette.error.main }}
        alt={'Group deleted'}
      >
        <HighlightOffIcon />
      </Avatar>
    );
  if (type === '~')
    return (
      <Avatar sx={{ backgroundColor: palette.info.main }} alt={'Group updated'}>
        <UpdateIcon />
      </Avatar>
    );
  if (type === '+')
    return (
      <Avatar
        sx={{ backgroundColor: palette.success.main }}
        alt={'Group created'}
      >
        <AddCircleOutlineIcon />
      </Avatar>
    );
  return (
    <Avatar
      sx={{ backgroundColor: palette.secondary.main }}
      alt={'Unknown change type'}
    >
      <HelpOutlineIcon />
    </Avatar>
  );
}
