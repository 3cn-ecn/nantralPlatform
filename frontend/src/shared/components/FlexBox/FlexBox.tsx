import React from 'react';

import { Box, BoxProps } from '@mui/material';

type FlexBoxProps = BoxProps;

export function FlexBox({ children, ...props }: FlexBoxProps) {
  return (
    <Box display="flex" {...props}>
      {children}
    </Box>
  );
}
