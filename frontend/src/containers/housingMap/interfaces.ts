export interface Housing {
  id: number;
  url: string;
  roommates: Roommate;
  address: string;
  details: string;
  latitude: number;
  longitude: number;
}
export interface Roommate {
  members: Member[];
  url: string;
  name: string;
  begin_date: string;
  end_date: string;
}
export interface Member {
  nickname: string;
  name: string;
}

export interface CityInfoProps {
  housing: Housing;
  housingDetailsUrl: string;
}

export interface PinProps {
  size: number;
  onClick: any;
}
