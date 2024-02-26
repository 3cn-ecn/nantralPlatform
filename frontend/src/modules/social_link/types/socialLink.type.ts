import { SocialNetwork } from './socialNetwork.type';

export interface SocialLink {
  id: number;
  label: string;
  uri: string;
  network: SocialNetwork;
}

export type SocialLinkForm = Pick<SocialLink, 'label' | 'uri'> & {
  id?: number;
  network: number;
};
