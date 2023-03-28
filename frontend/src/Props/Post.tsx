import { snakeToCamelCase } from '../utils/camel';
import { GroupProps, SimpleGroupProps } from './Group';

export interface PostProps {
  id: number;
  color: string;
  title: string;
  description: string;
  publicationDate: Date;
  /** Date of last modification */
  updatedAt: Date;
  image: string | File;
  /** Id of the group */
  group: number;
  groupSlug: string;
  slug: string;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  pageSuggestion: string;
}

export interface FormPostProps {
  title: string;
  /** Html converted to string */
  description: string;
  publicationDate: Date;
  image?: string | File;
  /** Id of the group */
  group: number;
  publicity: 'Pub' | 'Mem';
  pinned?: boolean;
  pageSuggestion?: string;
}

export function postsToCamelCase(posts: Array<any>): void {
  posts.forEach((post) => {
    snakeToCamelCase(post, { publicationDate: 'Date', updatedAt: 'Date' });
  });
}
