import { PropsWithChildren } from 'react';

import { Typography } from '@mui/material';

export function Address({ children }: PropsWithChildren) {
  return (
    <Typography sx={{ ml: 2, mt: 1 }} component="div" paragraph>
      <Typography sx={{ lineHeight: 1.6 }}>{children}</Typography>
    </Typography>
  );
}
