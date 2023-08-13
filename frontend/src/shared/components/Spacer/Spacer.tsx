import { CSSProperties } from 'react';

import { Box, useTheme } from '@mui/material';

type SpacerProps = {
  horizontal?: number;
  vertical?: number;
  flex?: CSSProperties['flex'];
};

export function Spacer({ horizontal, vertical, flex }: SpacerProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minWidth: horizontal && theme.spacing(horizontal),
        minHeight: vertical && theme.spacing(vertical),
        flex,
      }}
    />
  );
}
