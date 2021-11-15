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

export function sendNewOrder(orderedMembers: Member[], membersURL: string) {
  axios
    .post(membersURL, {
      orderedMembers: orderedMembers.map((e, i) => {
        return { id: e.id, order: e.order };
      }),
    })
    .then((resp) => {
      console.log(resp);
    });
}
