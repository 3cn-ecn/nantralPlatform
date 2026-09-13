import { PropsWithChildren } from 'react';

import { useSortable } from '@dnd-kit/react/sortable';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { IconButton, Stack, useTheme } from '@mui/material';
import { UUID } from 'crypto';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { MoveRemoveControls } from '#modules/form/view/Layout/MoveRemoveControls';

export function MovableContainer({
  parentId,
  nodeId,
  index = 0,
  lastIdx,
  children,
  accept,
}: {
  parentId: UUID;
  nodeId: UUID;
  index: number;
  lastIdx: number;
  accept: string[];
} & PropsWithChildren) {
  const theme = useTheme();
  const { form } = useFormContext();

  const { ref, isDragging, handleRef } = useSortable({
    id: nodeId,
    index,
    type: form.nodes[nodeId].payload.type,
    accept,
    group: parentId,
  });

  return (
    <Stack
      ref={parentId && ref}
      data-dragging={isDragging}
      gap={1}
      p={1}
      width={'100%'}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        transition: 'all 0.15s ease',
        borderRadius: `${theme.shape.borderRadius}px`,
        // only apply hover effect if it not a children that is actually hovered
        // uses className property to identify children to consider
        '&:hover:not(:has(.layout:hover))': {
          backgroundColor: theme.palette.action.hover,
        },
        opacity: isDragging ? '50%' : undefined,
      }}
      className={'layout'}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <IconButton ref={handleRef} size={'small'}>
          <DragIndicatorIcon />
        </IconButton>

        <MoveRemoveControls
          nodeId={nodeId}
          parentId={parentId}
          index={index}
          lastIdx={lastIdx}
        />
      </Stack>

      {children}
    </Stack>
  );
}

export function MovableContainerOverlay({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <Stack
      gap={1}
      p={1}
      width={'100%'}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,
        borderRadius: `${theme.shape.borderRadius}px`,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <IconButton size="small">
          <DragIndicatorIcon />
        </IconButton>

        <Stack direction={'row'} gap={1}>
          <IconButton size="small">
            <ArrowUpwardIcon />
          </IconButton>
          <IconButton size="small">
            <DeleteIcon />
          </IconButton>
          <IconButton size="small">
            <ArrowDownwardIcon />
          </IconButton>
        </Stack>
      </Stack>

      {children}
    </Stack>
  );
}
