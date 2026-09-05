import { useMemo } from 'react';

import { Box, Step } from '@mui/material';
import { UUID } from 'crypto';

import { LAYOUT_TYPES } from '#modules/form/constants';
import { useFormContext } from '#modules/form/hooks/useFormContext';
import { DropLayoutPlaceHolder } from '#modules/form/view/shared/DropLayoutPlaceholder';
import {
  MovableContainer,
  MovableContainerOverlay,
} from '#modules/form/view/shared/MovableContainer';

export function Layout({ nodeId }: { nodeId: UUID }) {
  const { form, draggedItem } = useFormContext();
  const node = form.nodes[nodeId];

  const isEmpty = useMemo(
    () => node.children.length === 0,
    [node.children.length],
  );

  const layout = useMemo(
    () => LAYOUT_TYPES[node.payload.type],
    [node.payload.type],
  );
  // if (!('elements' in node.payload)) {
  //   return <QuestionFields nodeId={actualNodeId} />;
  // }

  return (
    <Box flexGrow={2}>
      <layout.element
        nodeId={nodeId}
        canAccept={
          Boolean(draggedItem) &&
          layout.allowedChildren.some(
            (layoutName) => layoutName === draggedItem,
          )
        }
      >
        {node.children.map((childId, i) =>
          node.payload.type === 'Categorization' ? (
            <Step active key={childId}>
              <MovableContainer
                parentId={nodeId}
                nodeId={childId}
                index={i}
                lastIdx={node.children.length - 1}
                accept={layout.allowedChildren}
              >
                <Layout key={childId} nodeId={childId} />
              </MovableContainer>
            </Step>
          ) : (
            <MovableContainer
              key={childId}
              parentId={nodeId}
              nodeId={childId}
              index={i}
              lastIdx={node.children.length - 1}
              accept={layout.allowedChildren}
            >
              <Layout key={childId} nodeId={childId} />
            </MovableContainer>
          ),
        )}
        {isEmpty && (
          <DropLayoutPlaceHolder
            parentId={nodeId}
            accept={layout.allowedChildren}
          />
        )}
      </layout.element>
    </Box>
  );
}

export function LayoutOverlay({ nodeId }: { nodeId: UUID }) {
  const { form } = useFormContext();
  const node = form.nodes[nodeId];

  const isEmpty = useMemo(
    () => node.children.length === 0,
    [node.children.length],
  );

  const layout = useMemo(
    () => LAYOUT_TYPES[node.payload.type],
    [node.payload.type],
  );
  return (
    <Box flexGrow={2}>
      <layout.element nodeId={nodeId}>
        <Box border={'1px solid transparent'}>
          {node.children.map((childId) => (
            <MovableContainerOverlay key={childId}>
              <LayoutOverlay key={childId} nodeId={childId} />
            </MovableContainerOverlay>
          ))}
          {isEmpty && <DropLayoutPlaceHolder parentId={nodeId} accept={[]} />}
        </Box>
      </layout.element>
    </Box>
  );
}
