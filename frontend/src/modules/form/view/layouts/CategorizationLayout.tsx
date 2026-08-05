import { PropsWithChildren } from 'react';

import { Stepper, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

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
    <FlexCol gap={1}>
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
    </FlexCol>
  );
}
