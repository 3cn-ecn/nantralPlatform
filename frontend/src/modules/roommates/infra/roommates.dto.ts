export interface RoommatesDTO {
  name: string;
  begin_date: string;
  end_date: string;
  url: string;
}

export interface RoommatesMembershipDTO {
  id: number;
  nickname: string;
  group: RoommatesDTO;
}
