import * as React from 'react';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

import { Member } from './interfaces';
import { StudentCard } from './studentCard';

export function SortableStudentCard(props): JSX.Element {
  let member: Member = props.member;
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: member.id.toString() });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    //opacity: isDragging ? 0 : 100,
    zIndex: isDragging ? 1000 : 'auto',
  };
  return (
    <StudentCard
      member={member}
      editMode={true}
      listeners={listeners}
      attributes={attributes}
      sortStyle={style}
      newRef={setNodeRef}
    />
  );
}
