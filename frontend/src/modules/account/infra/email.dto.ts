export interface EmailDTO {
  uuid: string;
  email: string;
  is_valid: boolean;
  is_authorized_organisation_email: boolean;
  authorized_organisation: string | null;
  is_main: boolean;
  is_visible: boolean;
}
