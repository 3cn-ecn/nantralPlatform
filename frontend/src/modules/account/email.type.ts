export interface Email {
  uuid: string;
  email: string;
  isValid: boolean;
  isAuthorizedOrganisationEmail: boolean;
  authorizedOrganisation: string | null;
  isMain: boolean;
  isVisible: boolean;
}
