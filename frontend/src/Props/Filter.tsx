export interface FilterFrontInterface {
  id: string;
  name: string;
  icon: any;
  isMenu?: boolean;
  content: any;
}

export interface FilterInterface {
  dateBegin: string;
  dateEnd: string;
  favorite: boolean;
  participate: boolean;
  shotgun: boolean;
  organiser: string;
}
