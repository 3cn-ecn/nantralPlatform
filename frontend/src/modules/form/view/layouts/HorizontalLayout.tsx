import { PropsWithChildren } from 'react';

import { Stack, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';

export function HorizontalLayout({
  children,
  nodeId,
  canAccept,
}: PropsWithChildren & { nodeId: UUID; canAccept?: boolean }) {
  const theme = useTheme();
  return (
    <Stack gap={2}>
      <Stack
        direction={{ md: 'row' }}
        gap={2}
        border={'1px solid'}
        borderColor={canAccept ? undefined : 'transparent'}
        borderRadius={`${theme.shape.borderRadius}px`}
      >
        {children}
      </Stack>
      <AddChildButton nodeId={nodeId} />
    </Stack>
  );
}
