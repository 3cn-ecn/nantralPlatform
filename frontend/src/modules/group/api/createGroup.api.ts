import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { adaptGroup, adaptGroupForm } from '../infra/group.adapter';
import { CreateGroupFormDTO, GroupDTO } from '../infra/group.dto';
import { CreateGroupForm } from '../types/group.types';

export async function createGroupApi(type: string, formData: CreateGroupForm) {
  const { data } = await axios
    .post<CreateGroupFormDTO, AxiosResponse<GroupDTO>>(
      '/api/group/group/',
      adaptGroupForm(formData),
      {
        // convert data to FormData object only if there is an image,
        // because FormData removes fields with null values
        headers:
          formData.icon || formData.banner
            ? { 'Content-Type': 'multipart/form-data' }
            : {},
        params: {
          type: type,
        },
      },
    )
    .catch((err: ApiFormErrorDTO<CreateGroupFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptGroup(data);
}
