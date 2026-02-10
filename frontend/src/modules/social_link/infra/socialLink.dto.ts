export interface SocialLinkDTO {
  id: number;
  label: string;
  uri: string;
}

export type SocialLinkFormDTO = Pick<SocialLinkDTO, 'label' | 'uri'> & {
  id?: number;
  user?: number;
};
