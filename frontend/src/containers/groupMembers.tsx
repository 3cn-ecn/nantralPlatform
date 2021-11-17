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
import axios from "axios";

import { spinnerDivStyle, spinnerStyle } from "./clubsList/styles";
import { loaderStyle } from "./groupMembers/styles";
import { Member } from "./groupMembers/interfaces";
import { EditGroupMembersSwitch } from "./groupMembers/groupMembersEditSwitch";
import { SortableStudentCard } from "./groupMembers/sortableStudentCard";
import { StudentCard } from "./groupMembers/studentCard";
import { getMembers, sendNewOrder } from "./groupMembers/utils";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

function Root(props): JSX.Element {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingSort, setIsRefreshingSort] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [editMembersOrderMode, setEditMembersOrderMode] = useState(false);

  const handleEditMembersOrderMode = (e) => {
    setEditMembersOrderMode(e);
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    getMembers(props.membersURL, setMembers, setIsLoading, setIsAuthorized);
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
      let oldMembers = members.map((e) => {
        return { id: e.id, order: e.order };
      });
      let oldIndex = members.findIndex((e) => e.id === parseInt(active.id));
      let newIndex = members.findIndex((e) => e.id === parseInt(over.id));
      let newMembers: Member[] = arrayMoveImmutable(
        members,
        oldIndex,
        newIndex
      ).map((e: Member, i: number) => {
        e.order = i + 1;
        return e;
      });
      sendNewOrder(
        newMembers,
        oldMembers,
        props.membersURL,
        setIsRefreshingSort
      );
      setMembers(newMembers);
    }
  };

  if (!editMembersOrderMode) {
    return (
      <>
        {props.isAdmin ? (
          <EditGroupMembersSwitch
            status={editMembersOrderMode}
            handle={handleEditMembersOrderMode}
          />
        ) : (
          <></>
        )}
        <div className="row g-3">
          {members.length > 0
            ? members.map((member: Member, key: number) => {
                return <StudentCard member={member} key={key} />;
              })
            : "Aucun membre pour l'instant... 😥"}
        </div>
      </>
    );
  }

  return (
    <>
      {props.isAdmin ? (
        <EditGroupMembersSwitch
          status={editMembersOrderMode}
          handle={handleEditMembersOrderMode}
        />
      ) : (
        <></>
      )}
      <div className="row g-3" style={isRefreshingSort ? loaderStyle : null}>
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
    </>
  );
}

render(
  <Root membersURL={membersURL} isAdmin={is_admin} />,
  document.getElementById("root2")
);
