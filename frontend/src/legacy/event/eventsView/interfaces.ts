export interface Student {
  name: string;
  get_absolute_url: string;
}

export interface Urls {
  add: string;
  remove: string;
  participants: string;
}

export interface EventInfos {
  title: string;
  group: { slug: string; name: string };
  description: string;
  location: string;
  start_date: Date;
  end_date: Date;
  publicity: string;
  image: string;
  number_of_participants: number;
  id: number;
  is_participating: boolean;
  is_member: boolean;
}

export interface ExportProps {
  participants: Student[];
  title: string;
}
