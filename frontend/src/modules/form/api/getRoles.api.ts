import axios from 'axios';
import { UUID } from 'crypto';

import { adaptUserRole } from '#modules/form/infra/jsonForm.adapter';
import { adaptApiErrors } from '#shared/infra/errors';
import { adaptPage } from '#shared/infra/pagination';

interface RolesApiOptions {
  page?: number | null;
  pageSize?: number | null;
}

export async function getRolesApi(schema: UUID, options: RolesApiOptions) {
  const { data } = await axios
    .get(`/api/form/schema/${schema}/roles/`, {
      params: options,
    })
    .catch((error) => {
      throw adaptApiErrors(error);
    });
  return adaptPage(data, adaptUserRole);
}
