import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { DropResult } from '@hello-pangea/dnd';
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
}

export function DraggableList({
  items,
  reorderMemberships,
}: DraggableListProps) {
  /**
   * Callback after dropping for the drag-and-drop.
   * Send a request to the server to save the new order.
   */
  async function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination || result.destination.index === result.source.index)
      return;
    const source = result.source.index;
    const dest = result.destination.index;
    const reorderedMembers = reorder(items, source, dest);
    reorderMemberships(
      reorderedMembers,
      items[source],
      dest + 1 < items.length ? reorderedMembers[dest + 1] : undefined,
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <List ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item: Membership, index: number) => (
              <MemberDraggableListItem
                item={item}
                index={index}
                key={item.id}
              />
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}
