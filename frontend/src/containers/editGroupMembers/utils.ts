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
