import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";

import { Spinner } from "react-bootstrap";
import {
  DndContext,
  closestCenter,
  useSensor,
  DragOverlay,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMoveImmutable } from "array-move";

import { spinnerDivStyle, spinnerStyle } from "./clubsList/styles";
import { Member } from "./groupMembers/interfaces";
import { StudentCard } from "./groupMembers/studentCard";
import { SortableStudentCard } from "./editGroupMembers/sortableStudentCard";
import { membersSort } from "./editGroupMembers/utils";

function Root(props): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [activeID, setActiveID] = useState(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    async function getMembers(): Promise<void> {
      await fetch(props.membersURL)
        .then((resp) => {
          if (resp.status === 403) {
            setMembers([]);
            setIsAuthorized(false);
          }
          resp.json().then((data: Member[]) => {
            setMembers(
              data.sort(membersSort).map((e, i) => {
                if (e.order === 0) {
                  e.order = i + 1;
                }
                return e;
              })
            );
          });
        })
        .catch((err) => {
          setMembers([]);
        })
        .finally(() => setIsLoading(false));
    }
    getMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="grille" style={spinnerDivStyle}>
        <Spinner animation="border" role="status" style={spinnerStyle} />
      </div>
    );
  }

  if (!isAuthorized) {
    return <p>Veuillez vous connecter pour voir les membres.</p>;
  }

  const handleDragStart = (event) => {
    setActiveID(event.active.id);
  };
  const handleDragCancel = (event) => {
    setActiveID(null);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveID(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      let oldIndex = members.findIndex((e) => e.id === parseInt(active.id));
      let newIndex = members.findIndex((e) => e.id === parseInt(over.id));
      let newMembers = arrayMoveImmutable(members, oldIndex, newIndex);
      setMembers(
        newMembers.map((e, i) => {
          e.order = i;
          return e;
        })
      );
    }
  };

  return (
    <div className="row g-3">
      {members.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={members.map((e) => e.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {members.map((member: Member, index: number) => {
              return (
                <SortableStudentCard
                  member={member}
                  key={member.id}
                  index={index}
                />
              );
            })}
          </SortableContext>
          <DragOverlay>
            {activeID ? (
              <StudentCard
                member={members.find((e) => e.id == activeID)}
                editMode={true}
              />
            ) : null}
          </DragOverlay>{" "}
        </DndContext>
      ) : (
        "Aucun membre pour l'instant... 😥"
      )}
    </div>
  );
}

render(<Root membersURL={membersURL} />, document.getElementById("root2"));
