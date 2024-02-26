import { SocialNetwork } from '../types/socialNetwork.type';
import { SocialNetworkDTO } from './socialNetwork.dto';

export function adaptSocialNetwork(
  socialNetwork: SocialNetworkDTO,
): SocialNetwork {
  return {
    id: socialNetwork.id,
    color: socialNetwork.color,
    iconName: socialNetwork.icon_name,
    name: socialNetwork.name,
  };
}
