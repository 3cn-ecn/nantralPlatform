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
    admin?: boolean;
  } = {}
): Promise<Array<SimpleGroupProps | GroupProps>> {
  return axios
    .get<Page<SimpleGroupProps | GroupProps>>('/api/group/group/', {
      params: {
        is_member: options.isMember,
        simple: options.simple,
        order: options.order,
        is_admin: options.admin,
      },
    })
    .then((res) => res.data.results);
}

export async function getGroup(
  slug: string,
  options?: { simple?: boolean }
): Promise<GroupProps> {
  return axios
    .get<GroupProps>(`/api/group/group/${slug}`, {
      params: { simple: options.simple },
    })
    .then((res) => res.data);
}
