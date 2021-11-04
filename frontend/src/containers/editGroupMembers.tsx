import * as React from "react";
import { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import { Spinner } from "react-bootstrap";

import { spinnerDivStyle, spinnerStyle } from "./clubsList/styles";
import { Member } from "./groupMembers/interfaces";
import { StudentCard } from "./groupMembers/studentCard";
import {
  SortableContainer,
  SortableElement,
  SortEndHandler,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";

const SortableItem = SortableElement(({ value }: { value }) => (
  <li>{value}</li>
));

const SortableList = SortableContainer(({ items }: { items }) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
  );
});

const membersSort = (a: Member, b: Member): number => {
  if (a.order === 0) {
    return -1;
  }
  if (b.order === 0) {
    return -1;
  }
  return a.order - b.order;
};

function Root(props): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

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

  const onSortEnd: SortEndHandler = (sort, event) => {
    let newMembers = arrayMoveImmutable(members, sort.oldIndex, sort.newIndex);
    setMembers(
      newMembers.map((e, i) => {
        e.order = i;
        return e;
      })
    );
    /*
    console.log(members.map((e) => e.order));
    let oldMembers = [...members];
    console.log("new", sort.newIndex + 1, "old", sort.oldIndex + 1);
    for (let i = 0; i < oldMembers.length; i++) {
      if (i == sort.oldIndex) {
        continue;
      }
      if (
        oldMembers[i].order <= sort.newIndex + 1 &&
        oldMembers[i].order >= sort.oldIndex + 1
      ) {
        oldMembers[i].order--;
        console.log(oldMembers[i]);
      }
    }
    oldMembers[sort.oldIndex].order = sort.newIndex + 1;
    setMembers(oldMembers.sort(membersSort));
    console.log(oldMembers.find((e) => e.order == 1));*/
  };

  return (
    <div className="row g-3">
      {members.length > 0 ? (
        <SortableList
          items={members.map((member: Member, key: number) => {
            return <StudentCard member={member} key={key} />;
          })}
          onSortEnd={onSortEnd}
        />
      ) : (
        "Aucun membre pour l'instant... 😥"
      )}
    </div>
  );
}

render(<Root membersURL={membersURL} />, document.getElementById("root2"));
