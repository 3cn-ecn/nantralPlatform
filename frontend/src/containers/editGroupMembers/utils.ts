import axios from "axios";

import { Member } from "../groupMembers/interfaces";
import { getMembers } from "../groupMembers/utils";

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
  admin: boolean,
  handleClose: () => void,
  setIsUpdateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
): void {
  setIsUpdateLoading(true);
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
    .finally(() => {
      setIsUpdateLoading(false);
      handleClose();
      getMembers(membersUrl, setMembers, setIsLoading);
    });
}

export function deleteMember(
  membersUrl: string,
  member: Member,
  handleClose: () => void,
  setIsUpdateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
): void {
  setIsUpdateLoading(true);
  axios
    .post(membersUrl, {
      editMode: 3,
      id: member.id,
    })
    .then((resp) => {
      if (resp.status !== 200) {
        console.error(
          "Le membre n'a pas pu être supprimé.",
          "ERR:",
          resp.status
        );
      }
    })
    .catch((e) => {
      console.error("Le membre n'a pas pu être supprimé.");
    })
    .finally(() => {
      setIsUpdateLoading(false);
      handleClose();
      getMembers(membersUrl, setMembers, setIsLoading);
    });
}
