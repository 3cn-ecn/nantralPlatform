import { convertFromPythonData } from '../utils/convertData';
import { SimpleGroupProps } from './Group';

export interface PostProps {
  id: number;
  color: string;
  title: string;
  description: string;
  createdAt: Date;
  /** Date of last modification */
  updatedAt: Date;
  image: string | File;
  group: SimpleGroupProps;
  publicity: 'Pub' | 'Mem';
  pinned: boolean;
  canPin: boolean;
  isAdmin: boolean;
}

export interface FormPostProps {
  title: string;
  /** Html converted to string */
  description: string;
  createdAt: Date;
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
    createdAt: 'Date',
    updatedAt: 'Date',
  } as any);
}
