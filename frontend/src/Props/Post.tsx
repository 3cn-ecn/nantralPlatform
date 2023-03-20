import { Blob } from 'buffer';
import { snakeToCamelCase } from '../utils/camel';

export interface PostProps {
  id: number;
  color: string;
  title: string;
  description: string;
  publicationDate: Date;
  /** Date of last modification */
  editDate: Date;
  image: string | File;
  /** Id of the group */
  group: number;
  groupSlug: string;
  slug: string;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  pageSuggestion: string;
}

export function postsToCamelCase(posts: Array<any>): void {
  posts.forEach((post) => {
    snakeToCamelCase(post, { publicationDate: 'Date', editDate: 'Date' });
  });
}
