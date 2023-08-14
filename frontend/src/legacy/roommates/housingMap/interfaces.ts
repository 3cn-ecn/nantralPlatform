export interface Housing {
  id: number;
  roommates: Roommates;
  address: string;
  details: string;
  latitude: number;
  longitude: number;
}

export interface Roommates {
  name: string;
  begin_date: string;
  end_date?: string;
  members: Member[];
  url: string;
  colocathlon_agree: boolean;
  colocathlon_quota: number;
  colocathlon_hours: string;
  colocathlon_activities: string;
  colocathlon_participants: ColocathlonParticipant[];
}

export interface Member {
  nickname: string;
  name: string;
}

export interface ColocathlonParticipant {
  id: number;
  name: string;
  url: string;
  promo: number;
  picture?: string;
  faculty: string;
  path?: string;
  user: number;
}

export interface ColocInfoProps {
  housing: Housing;
  colocathlonOnly: boolean;
}

export interface PinProps {
  size: number;
  onClick: any;
}

export interface ColocathlonSwitchProps {
  status: boolean;
  handle: (any) => void;
}

export interface CurrentColocInfoProps {
  colocName: string;
  colocUrl: string;
}
