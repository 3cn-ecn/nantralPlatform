import axios from 'axios';
import {
  FormPostProps,
  PostProps,
  convertPostFromPythonData,
} from '../Props/Post';

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
        pinned: options.pinned,
        from_date: options.fromDate,
        to_date: options.toDate,
        limit: options.limit,
      },
    })
    .then((res) => convertPostFromPythonData(res.data));
}

function createForm(values: FormPostProps): FormData {
  const formData = new FormData();
  if (values.image && typeof values.image !== 'string')
    formData.append('image', values.image, values.image.name);
  if (values.group) formData.append('group', values.group.toString());
  formData.append('publicity', values.publicity);
  formData.append('title', values.title || '');
  formData.append('description', values.description || '<p></p>');
  if (values.pageSuggestion)
    formData.append('page_suggestion', values.pageSuggestion);
  formData.append('created_at', values.createdAt.toISOString());
  formData.append('pinned', values.pinned ? 'true' : 'false');
  return formData;
}

export async function createPost(
  options?: FormPostProps
): Promise<FormPostProps> {
  return axios
    .post(`/api/post/`, createForm(options), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((res) => {
      convertPostFromPythonData(res.data);
      return res.data;
    });
}

export async function updatePost(
  id: number,
  options?: FormPostProps
): Promise<void | FormPostProps> {
  return axios
    .put(`/api/post/${id}/`, createForm(options), {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((res) => {
      convertPostFromPythonData(res.data);
      return res.data;
    });
}

export async function deletePost(id: number): Promise<void> {
  return axios.delete(`/api/post/${id}/`);
}
