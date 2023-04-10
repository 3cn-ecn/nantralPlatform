import axios from 'axios';
import { PostProps, convertPostFromPythonData } from '../Props/Post';

export async function getPost(id: number) {
  return axios
    .get<PostProps>(`/api/post/${id}/`)
    .then((res) => res.data)
    .then((data) => convertPostFromPythonData(data));
}

export async function getPosts(
  options: {
    pinned?: boolean;
    fromDate?: Date;
    toDate?: Date;
    limit?: number;
  } = {}
) {
  return axios
    .get<PostProps[]>(`/api/post/`, {
      params: {
        pinned: options.pinned || undefined,
        from_date: options.fromDate,
        to_date: options.toDate,
        limit: options.limit,
      },
    })
    .then((res) => convertPostFromPythonData(res.data));
}
