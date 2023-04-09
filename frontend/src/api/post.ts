import axios from 'axios';
import { PostProps, postsToCamelCase } from '../Props/Post';

export async function getPost(id: number): Promise<PostProps> {
  const { data } = await axios.get(`/api/post/${id}/`);
  postsToCamelCase([data]);
  return data;
}

export async function getPosts(options?: {
  pinned?: boolean;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}): Promise<PostProps[]> {
  const { data } = await axios.get(`/api/post/`, {
    params: {
      pinned: options?.pinned || undefined,
      from_date: options?.fromDate,
      to_date: options?.toDate,
      limit: options?.limit,
    },
  });
  postsToCamelCase(data);
  return data;
}
