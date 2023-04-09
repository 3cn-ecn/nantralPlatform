import { GroupProps, SimpleGroupProps } from 'Props/Group';
import axios from 'axios';

export async function getMyGroups(): Promise<SimpleGroupProps[]> {
  const { data } = await axios.get('/api/group/group/', {
    params: { is_member: true, simple: true },
  });
  return data.results;
}

export async function getGroups(): Promise<SimpleGroupProps[] | GroupProps[]> {
  const { data } = await axios.get('/api/group/group/', {
    params: { is_member: true, simple: true },
  });
  return data.results;
}
