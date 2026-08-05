import { PropsWithChildren } from 'react';

import { useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { AddChildButton } from '#modules/form/view/Layout/AddChildButton';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function VerticalLayout({
  children,
  nodeId,
  canAccept,
}: PropsWithChildren & { nodeId: UUID; canAccept?: boolean }) {
  const theme = useTheme();
  return (
    <FlexCol gap={2}>
      <FlexCol
        gap={2}
        border={'1px solid'}
        borderColor={canAccept ? undefined : 'transparent'}
        borderRadius={`${theme.shape.borderRadius}px`}
      >
        {children}
      </FlexCol>
      <AddChildButton nodeId={nodeId} />
    </FlexCol>
  );
}
