import axios from 'axios';

import { FormPostProps, convertPostFromPythonData } from '#types/Post';

/** Format data to work with django api. Might need to find a more elegant solution in the future */
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
    .post('/api/post/', createForm(options), {
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
): Promise<FormPostProps> {
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
