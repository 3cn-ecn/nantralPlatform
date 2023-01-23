export interface EventProps {
  color: string;
  date: Date;
  description: string;
  get_absolute_url: string;
  get_group_name: string;
  group: string;
  image: string;
  is_member: boolean;
  is_participating: boolean;
  location: string;
  number_of_participants: number;
  publicity: string;
  slug: string;
  title: string;
  max_participant: number;
  end_inscription: Date;
}
