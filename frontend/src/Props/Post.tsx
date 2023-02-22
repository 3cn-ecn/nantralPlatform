export interface PostProps {
  color: string;
  title: string;
  description: string;
  publication_date: string;
  image: string;
  group: string;
  slug: string;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
}
