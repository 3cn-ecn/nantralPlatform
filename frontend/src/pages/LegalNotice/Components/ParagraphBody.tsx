import { PropsWithChildren } from 'react';

import { Typography } from '@mui/material';

export function ParagraphBody({ children }: PropsWithChildren) {
  return (
    <Typography sx={{ mb: 2, lineHeight: 1.7 }} component="div" paragraph>
      {children}
    </Typography>
  );
}
