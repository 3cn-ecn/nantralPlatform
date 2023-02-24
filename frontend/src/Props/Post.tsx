export interface PostProps {
  color: string;
  title: string;
  description: string;
  publication_date: string;
  image: string;
  group_slug: string;
  slug: string;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  page_suggestion: string;
}
