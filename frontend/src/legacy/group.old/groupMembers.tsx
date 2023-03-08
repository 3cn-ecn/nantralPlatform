import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { Spinner } from 'react-bootstrap';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { arrayMoveImmutable } from 'array-move';
import axios from '../utils/axios';

import { spinnerDivStyle, spinnerStyle } from '../club/clubsList/styles';
import { loaderStyle } from './groupMembers/styles';
import { Member } from './groupMembers/interfaces';
import { EditGroupMembersSwitch } from './groupMembers/groupMembersEditSwitch';
import { SortableStudentCard } from './groupMembers/sortableStudentCard';
import { StudentCard } from './groupMembers/studentCard';
import { getMembers, sendNewOrder } from './groupMembers/utils';

declare const membersURL: string;
declare const isAdmin: string;

function Root(props: {}): JSX.Element {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingSort, setIsRefreshingSort] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [editMembersOrderMode, setEditMembersOrderMode] = useState(false);

  const handleEditMembersOrderMode = (e) => {
    setEditMembersOrderMode(e.target.checked);
  };

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    getMembers(membersURL, setMembers, setIsLoading, setIsAuthorized);
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
      sendNewOrder(newMembers, oldMembers, membersURL, setIsRefreshingSort);
      setMembers(newMembers);
    }
  };

  if (!editMembersOrderMode) {
    return (
      <>
        {isAdmin ? (
          <EditGroupMembersSwitch
            status={editMembersOrderMode}
            handle={handleEditMembersOrderMode}
          />
        ) : (
          <></>
        )}
        {members.length > 0 ? (
          <div className="row g-3">
            {members.map((member: Member, key: number) => {
              return <StudentCard member={member} key={key} />;
            })}
          </div>
        ) : (
          "Aucun membre pour l'instant... 😥"
        )}
      </>
    );
  }

  return (
    <>
      {isAdmin ? (
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

render(<Root />, document.getElementById('root2'));
