import { ReactNode } from 'react';

import { Typography } from '@mui/material';

export function Address({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ ml: 2, mt: 1, mb: 2 }} component="div">
      <Typography sx={{ lineHeight: 1.6 }}>{children}</Typography>
    </Typography>
  );
}
