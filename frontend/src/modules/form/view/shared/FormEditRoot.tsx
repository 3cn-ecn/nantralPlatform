import { useCallback, useRef } from 'react';

import {
  DragDropEventHandlers,
  DragDropProvider,
  DragOverlay,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { Step, Stepper } from '@mui/material';
import { UUID } from 'crypto';

import { useFormContext } from '#modules/form/hooks/useFormContext';
import { isDescendent } from '#modules/form/state/utils';
import { Layout, LayoutOverlay } from '#modules/form/view/Layout/Layout';
import { MovableContainerOverlay } from '#modules/form/view/shared/MovableContainer';
import { SelectBaseComponent } from '#modules/form/view/shared/SelectBaseComponent';

export function FormEditRoot() {
  const { form, setForm, moveNode, setDraggedItem } = useFormContext();
  const snapshot = useRef(structuredClone(form));

  return (
    <>
      <SelectBaseComponent />
      <DragDropProvider
        onDragStart={useCallback<DragDropEventHandlers['onDragStart']>(
          (event) => {
            setDraggedItem(event.operation.source?.type as string);
            snapshot.current = structuredClone(form);
          },
          [form, setDraggedItem],
        )}
        onDragEnd={useCallback<DragDropEventHandlers['onDragEnd']>(
          (event) => {
            if (event.canceled) {
              setForm(snapshot.current);
              return;
            }
            setDraggedItem(null);
          },
          [setDraggedItem, setForm],
        )}
        onDragOver={(event) => {
          const { source, target } = event.operation;
          if (
            event.operation.canceled ||
            !target ||
            !isSortable(source) ||
            source.id === target.id
          ) {
            return;
          }

          if (isSortable(target) && target.group !== source.id) {
            // target is a layout or a tab
            if (
              isDescendent(form, target.group as UUID, source.id as UUID) ||
              target.group === source.id ||
              target.group === 'no-drop'
            ) {
              console.warn('Invalid move');
              return;
            }
            moveNode(source.id as UUID, target.group as UUID, target.index);
          } else if (target.type === 'placeholder' || target.type === 'tabs') {
            // get the actual id
            const targetId = (target.id as string).substring('drop-'.length);
            if (
              isDescendent(form, targetId as UUID, source.id as UUID) ||
              targetId === source.id
            ) {
              console.warn(
                'Invalid move: cannot move a node into itself or its descendants',
              );
              return;
            }
            moveNode(source.id as UUID, targetId as UUID);
          }
        }}
      >
        <Layout nodeId={form.root} />
        <DragOverlay>
          {(source) =>
            source.type === 'Category' ? (
              <Stepper>
                <Step
                  active
                  component={() => (
                    <MovableContainerOverlay>
                      <LayoutOverlay nodeId={source.id as UUID} />
                    </MovableContainerOverlay>
                  )}
                />
              </Stepper>
            ) : (
              <MovableContainerOverlay>
                <LayoutOverlay nodeId={source.id as UUID} />
              </MovableContainerOverlay>
            )
          }
        </DragOverlay>
      </DragDropProvider>
    </>
  );
}
