import { Member } from "../groupMembers/interfaces";

export interface EditGroupMembersModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMember: Member;
  membersURL: string;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
