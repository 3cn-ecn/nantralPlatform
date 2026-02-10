import { UserPreview } from '#modules/account/user.types';

export interface AdminRequestDTO {
  id: number;
  user: UserPreview;
  admin: boolean;
  admin_request_message: string;
}
