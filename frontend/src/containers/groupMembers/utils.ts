import { Member } from "./interfaces";
import axios from "axios";

import { membersSort } from "../editGroupMembers/utils";

var dayjs = require("dayjs");
require("dayjs/locale/fr");
dayjs.locale("fr");

export function makeNiceDate(date: string): string {
  if (date === null) {
    return null;
  }
  return dayjs(date, "YYYY-MM-DD").format("D MMMM YYYY");
}

export function sendNewOrder(
  orderedMembers: Member[],
  unorderedMembers: Member[],
  membersURL: string,
  setIsRefreshingSort: React.Dispatch<React.SetStateAction<boolean>>
) {
  setIsRefreshingSort(true);
  let membersToUpdate = [];
  for (let i = 0; i < orderedMembers.length; i++) {
    if (unorderedMembers[i].id !== orderedMembers[i].id) {
      membersToUpdate.push({
        id: orderedMembers[i].id,
        order: orderedMembers[i].order,
      });
    }
  }
  axios
    .post(membersURL, {
      editMode: 1,
      orderedMembers: membersToUpdate,
    })
    .then((resp) => {
      if (resp.status !== 200) {
        console.error(
          "L'ordre des membres n'a pas pu être mis à jour.",
          "ERR:",
          resp.status
        );
      }
    })
    .catch((e) => {
      console.error("L'ordre des membres n'a pas pu être mis à jour.");
    })
    .finally(() => setIsRefreshingSort(false));
}

export async function getMembers(
  membersURL: string,
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>> = null
): Promise<void> {
  setIsLoading(true);
  await fetch(membersURL)
    .then((resp) => {
      if (resp.status === 403) {
        setMembers([]);
        if (setIsAuthorized) {
          setIsAuthorized(true);
        }
      }
      resp.json().then((data: Member[]) => {
        setMembers(data);
      });
    })
    .catch((err) => {
      setMembers([]);
    })
    .finally(() => setIsLoading(false));
}
