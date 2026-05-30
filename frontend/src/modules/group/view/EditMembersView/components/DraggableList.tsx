import { useState } from 'react';

import { DragEndEvent, DragOverEvent } from '@dnd-kit/react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import { List } from '@mui/material';

import { Membership } from '#modules/group/types/membership.types';

import { MemberDraggableListItem } from './MemberDraggableListItem';

/**
 * A little function to help us reorder items
 *
 * @param list - the list of items
 * @param startIndex
 * @param endIndex
 * @returns the re-ordered list
 */
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export interface DraggableListProps {
  items: Membership[];
  reorderMemberships: (
    orderedMemberships: Membership[],
    member: Membership,
    lower?: Membership,
  ) => void;
  onClick: (member: Membership) => void;
}

export function DraggableList({
  items,
  reorderMemberships,
  onClick,
}: DraggableListProps) {
  const [reorderedItems, setReorderedItems] = useState(items);

  /**
   * Callback after dropping for the drag-and-drop.
   * Send a request to the server to save the new order.
   */
  async function onDragEnd(event: DragEndEvent) {
    const { source, target } = event.operation;
    if (event.canceled) {
      setReorderedItems(items);
      return;
    }
    if (!isSortable(source) || !isSortable(target)) {
      return;
    }
    reorderMemberships(
      reorderedItems,
      reorderedItems[source.index],
      source.index + 1 < items.length
        ? reorderedItems[source.index + 1]
        : undefined,
    );
  }

  return (
    <DragDropProvider
      onDragEnd={onDragEnd}
      onDragOver={(event: DragOverEvent) => {
        const { source, target } = event.operation;

        if (
          !isSortable(source) ||
          !isSortable(target) ||
          target.index === source.index
        ) {
          return;
        }

        setReorderedItems(reorder(reorderedItems, source.index, target.index));
      }}
    >
      <List>
        {reorderedItems.map((item: Membership, index: number) => (
          <MemberDraggableListItem
            item={item}
            index={index}
            key={item.id}
            onClickEdit={() => onClick(item)}
          />
        ))}
      </List>
    </DragDropProvider>
  );
}
