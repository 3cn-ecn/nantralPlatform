import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Spinner } from "react-bootstrap";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { arrayMoveImmutable } from "array-move";

import { spinnerDivStyle, spinnerStyle } from "./clubsList/styles";
import { Member } from "./groupMembers/interfaces";
import { EditGroupMembersSwitch } from "./groupMembers/editGroupMembersSwitch";
import { SortableStudentCard } from "./editGroupMembers/sortableStudentCard";
import { StudentCard } from "./groupMembers/studentCard";

function Root(props): JSX.Element {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [editMembersOrderMode, setEditMembersOrderMode] = useState(false);

  const handleEditMembersOrderMode = (e) => {
    setEditMembersOrderMode(e);
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    async function getMembers(): Promise<void> {
      await fetch(props.membersURL)
        .then((resp) => {
          if (resp.status === 403) {
            setMembers([]);
            setIsAuthorized(false);
          }
          resp.json().then((data) => {
            setMembers(data);
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

  const handleDragEnd = (event: DragEndEvent) => {
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
  if (!editMembersOrderMode) {
    return (
      <div className="row g-3">
        <EditGroupMembersSwitch
          status={editMembersOrderMode}
          handle={handleEditMembersOrderMode}
        />
        {members.length > 0
          ? members.map((member: Member, key: number) => {
              return <StudentCard member={member} key={key} />;
            })
          : "Aucun membre pour l'instant... 😥"}
      </div>
    );
  }

  return (
    <div className="row g-3">
      <EditGroupMembersSwitch
        status={editMembersOrderMode}
        handle={handleEditMembersOrderMode}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={members.map((e) => e.id.toString())}
          strategy={rectSortingStrategy}
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
      </DndContext>
    </div>
  );
}

render(<Root membersURL={membersURL} />, document.getElementById("root2"));
