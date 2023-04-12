import { convertFromPythonData } from '../utils/convertData';
import { SimpleGroupProps } from './Group';

export interface PostProps {
  id: number;
  color: string;
  title: string;
  description: string;
  publicationDate: Date;
  /** Date of last modification */
  updatedAt: Date;
  image: string | File;
  group: SimpleGroupProps;
  slug: string;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  pageSuggestion: string;
  canPin: boolean;
  isAdmin: boolean;
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

export function convertPostFromPythonData<P = PostProps | PostProps[]>(
  data: P
): P {
  return convertFromPythonData(data, {
    publicationDate: 'Date',
    updatedAt: 'Date',
  } as any);
}
