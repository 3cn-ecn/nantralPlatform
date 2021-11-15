import { Member } from "./interfaces";
import axios from "axios";

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
  membersURL: string
) {
  let membersToUpdate = [];
  console.log(orderedMembers);
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
      orderedMembers: membersToUpdate,
    })
    .then((resp) => {
      console.log(resp);
    });
}
