import axios from "axios";

import { Member } from "../groupMembers/interfaces";

export function membersSort(a: Member, b: Member): number {
  if (a.order === 0) {
    return -1;
  }
  if (b.order === 0) {
    return -1;
  }
  return a.order - b.order;
}

export function updateMember(
  membersUrl: string,
  member: Member,
  role: string,
  beginDate: string,
  endDate: string,
  admin: boolean
) {
  axios
    .post(membersUrl, {
      editMode: 2,
      id: member.id,
      role: role,
      beginDate: beginDate,
      endDate: endDate,
      admin: admin,
    })
    .then((resp) => {
      if (resp.status !== 200) {
        console.error(
          "Le membre n'a pas pu être mis à jour.",
          "ERR:",
          resp.status
        );
      }
    })
    .catch((e) => {
      console.error("Le membre n'a pas pu être mis à jour.");
    })
    .finally();
}
