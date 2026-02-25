import { UserPreview } from '#modules/account/user.types';

import { GroupPreview } from './group.types';

export interface Membership {
  id: number;
  user: UserPreview;
  group: GroupPreview;
  summary: string;
  description: string;
  beginDate: Date;
  endDate: Date;
  priority: number;
  admin: boolean;
  adminRequest: string;
}

export type MembershipForm = Pick<
  Membership,
  'beginDate' | 'endDate' | 'summary' | 'description' | 'admin'
> & { user: number; group: number };

export type ShortMembershipForm = Pick<
  MembershipForm,
  'summary' | 'description' | 'beginDate' | 'endDate'
>;
