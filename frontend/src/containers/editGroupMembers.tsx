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
import { SortableStudentCard } from "./groupMembers/sortableStudentCard";
import { membersSort } from "./editGroupMembers/utils";

function Root(props): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getMembers(): Promise<void> {
      await fetch(props.membersURL)
        .then((resp) => {
          if (resp.status === 403) {
            setMembers([]);
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

  return (
    <div className="table-responsive">
      {members.length > 0 ? (
        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">NOM</th>
              <th scope="col" className="d-none d-sm-table-cell">
                Membre depuis
              </th>
              <th scope="col" className="d-none d-sm-table-cell">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((e, i) => (
              <tr style={{ transform: "rotate(0)" }} key={i}>
                <td>
                  <a href="/student/152/" className="stretched-link"></a>
                  {e.student.name}
                </td>
                <td className="d-none d-sm-table-cell">{e.date_begin}</td>
                <td className="d-none d-sm-table-cell">{e.function}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "Aucun membre pour l'instant... 😥"
      )}
    </div>
  );
}

render(<Root membersURL={membersURL} />, document.getElementById("root2"));
