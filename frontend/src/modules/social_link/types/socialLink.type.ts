export interface SocialLink {
  id: number;
  label: string;
  uri: string;
}

export type SocialLinkForm = Pick<SocialLink, 'label' | 'uri'> & {
  id?: number;
  user?: number;
};
