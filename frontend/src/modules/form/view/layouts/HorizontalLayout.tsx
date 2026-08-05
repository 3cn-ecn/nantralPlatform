import { PropsWithChildren } from 'react';

import { useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';
import { FlexAuto } from '#shared/components/FlexBox/FlexBox';

export function HorizontalLayout({
  children,
  nodeId,
  canAccept,
}: PropsWithChildren & { nodeId: UUID; canAccept?: boolean }) {
  const theme = useTheme();
  return (
    <FlexAuto gap={2}>
      <FlexAuto
        gap={2}
        border={'1px solid'}
        borderColor={canAccept ? undefined : 'transparent'}
        borderRadius={`${theme.shape.borderRadius}px`}
      >
        {children}
      </FlexAuto>
      <AddChildButton nodeId={nodeId} />
    </FlexAuto>
  );
}
