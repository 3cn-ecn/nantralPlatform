import { UserPreview } from '#modules/account/user.types';

export interface AdminRequest {
  id: number;
  user: UserPreview;
  admin: boolean;
  adminRequestMessage: string;
}
