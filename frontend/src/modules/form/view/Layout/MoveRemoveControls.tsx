import { useCallback } from 'react';

import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { UUID } from 'crypto';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';

export function MoveRemoveControls({
  nodeId,
  parentId,
  index,
  lastIdx,
}: {
  nodeId: UUID;
  parentId: UUID;
  index: number;
  lastIdx: number;
}) {
  const { moveNode, removeNode } = useFormContext();

  const handleMoveNode = useCallback(
    (direction: 'up' | 'down') => {
      if (index === undefined) return;
      const newIdx = direction === 'up' ? index - 1 : index + 1;
      if (newIdx < 0 || newIdx > lastIdx) return;
      moveNode(nodeId, parentId, newIdx);
    },
    [index, lastIdx, moveNode, nodeId, parentId],
  );

  return (
    <FlexCol gap={1}>
      <IconButton
        aria-label="move up"
        size="small"
        onClick={() => handleMoveNode('up')}
        disabled={index === 0}
      >
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        aria-label={'remove element'}
        size={'small'}
        onClick={() => removeNode(nodeId)}
      >
        <DeleteIcon />
      </IconButton>
      <IconButton
        aria-label="move down"
        size="small"
        onClick={() => handleMoveNode('down')}
        disabled={index === lastIdx}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </FlexCol>
  );
}
