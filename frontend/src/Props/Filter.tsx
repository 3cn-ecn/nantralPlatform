import { SimpleGroupProps } from './Group';

export interface FilterFrontInterface {
  id: string;
  name: string;
  icon: any;
  isMenu?: boolean;
  content: any;
  value?: any;
  onChangeValue?: (arg: any) => void;
}

export interface FilterInterface {
  dateBegin: string;
  dateEnd: string;
  favorite: boolean;
  participate: boolean;
  shotgun: boolean;
  organiser: SimpleGroupProps[];
}
