import * as React from "react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { Member } from "../groupMembers/interfaces";
import { StudentCard } from "../groupMembers/studentCard";

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
    opacity: isDragging ? 0 : 100,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <StudentCard
        member={member}
        editMode={true}
        listeners={listeners}
        attributes={attributes}
      />
    </div>
  );
}
