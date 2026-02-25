import { PropsWithChildren } from 'react';

import { Typography } from '@mui/material';

export function ParagraphTitle({ children }: PropsWithChildren) {
  return (
    <Typography variant="h4" sx={{ mt: 4, mb: 1 }}>
      {children}
    </Typography>
  );
}
