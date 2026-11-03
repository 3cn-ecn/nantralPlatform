import { Add } from '@mui/icons-material';
import { Fab, Stack } from '@mui/material';

export function MoreGroupButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <Stack
      sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}
    >
      <Fab onClick={onClick} variant="extended" sx={{ fontSize: 20 }}>
        <Add />
        {count}
      </Fab>
    </Stack>
  );
}
