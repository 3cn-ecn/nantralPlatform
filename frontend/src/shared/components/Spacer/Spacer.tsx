import { CSSProperties } from 'react';

import React, { Box } from '@mui/material';

type SpacerProps = {
  horizontal?: CSSProperties['minWidth'];
  vertical?: CSSProperties['minHeight'];
  flex?: CSSProperties['flex'];
};

export function Spacer({ horizontal, vertical, flex }: SpacerProps) {
  return <Box sx={{ minWidth: horizontal, minHeight: vertical, flex }} />;
}
