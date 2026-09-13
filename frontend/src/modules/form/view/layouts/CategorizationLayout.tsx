import { PropsWithChildren } from 'react';

import { Stack, Stepper, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';

export function CategorizationLayout({
  children,
  nodeId,
  canAccept,
}: {
  nodeId: UUID;
  canAccept?: boolean;
} & PropsWithChildren) {
  const theme = useTheme();

  return (
    <Stack gap={1}>
      <Stepper
        nonLinear
        orientation="vertical"
        sx={{
          border: '1px solid',
          borderColor: canAccept ? undefined : 'transparent',
          borderRadius: `${theme.shape.borderRadius}px`,
        }}
      >
        {children}
      </Stepper>
      <AddChildButton nodeId={nodeId} />
    </Stack>
  );
}
