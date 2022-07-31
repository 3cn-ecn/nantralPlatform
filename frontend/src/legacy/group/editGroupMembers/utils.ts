import axios from '../../../utils/axios';

import { Member, MemberAdd } from '../groupMembers/interfaces';
import { getMembers } from '../groupMembers/utils';

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
          'ERR:',
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
          'ERR:',
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

export function addMember(
  membersUrl: string,
  formData: MemberAdd,
  handleClose: () => void,
  setIsAddLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
): void {
  setIsAddLoading(true);
  axios
    .post(membersUrl, {
      editMode: 4,
      id: formData.id,
      date_begin: formData.date_begin,
      date_end: formData.date_end,
      admin: formData.admin,
      function: formData.function,
    })
    .then((resp) => {
      if (resp.status !== 200) {
        console.error("Le membre n'a pas pu être ajouté.", 'ERR:', resp.status);
      }
    })
    .catch((e) => {
      console.error("Le membre n'a pas pu être ajouté.");
    })
    .finally(() => {
      setIsAddLoading(false);
      handleClose();
      getMembers(membersUrl, setMembers, setIsLoading);
    });
}

export function getStudents(
  studentsURL: string,
  setStudents,
  setIsAddLoading
): void {
  setIsAddLoading(true);
  axios
    .get(studentsURL)
    .then((resp) => {
      if (resp.status !== 200) {
        console.error(
          "Les etudiants n'ont pas pu être récupérés.",
          'ERR:',
          resp.status
        );
      }
      setStudents(resp.data);
      setIsAddLoading(false);
    })
    .catch((e) => {
      console.error("L'ordre des membres n'a pas pu être mis à jour.");
    })
    .finally();
}
