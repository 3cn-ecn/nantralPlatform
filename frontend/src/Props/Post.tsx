import { snakeToCamelCase } from '../utils/camel';

export interface PostProps {
  id: number;
  color: string;
  title: string;
  description: string;
  publicationDate: Date;
  image: string;
  group: number; // id of the group
  groupSlug: string;
  slug: string;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  pageSuggestion: string;
}

export function postsToCamelCase(posts: Array<any>): void {
  posts.forEach((post) => {
    snakeToCamelCase(post, { publicationDate: 'Date' });
  });
}
