import { SocialNetworkDTO } from './socialNetwork.dto';

export interface SocialLinkDTO {
  id: number;
  label: string;
  uri: string;
  network: SocialNetworkDTO;
}

export type SocialLinkFormDTO = Pick<SocialLinkDTO, 'label' | 'uri'> & {
  id?: number;
  network: number;
};
