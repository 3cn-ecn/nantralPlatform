import axios from 'axios';
import { GroupProps, SimpleGroupProps } from '../Props/Group';
import { Page } from '../Props/pagination';

export async function getMyGroups() {
  return getGroups({ isMember: true });
}

export async function getGroups(
  options: {
    isMember?: boolean;
    simple?: boolean;
    limit?: number;
    order?: string;
  } = {}
) {
  return axios
    .get<Page<SimpleGroupProps | GroupProps>>('/api/group/group/', {
      params: {
        is_member: options.isMember,
        simple: options.simple,
        order: options.order,
      },
    })
    .then((res) => res.data.results);
}
