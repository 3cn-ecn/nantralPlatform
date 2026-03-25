import axios from 'axios';

import { adaptJsonFormError } from '#modules/form/infra/jsonFormError.adapter';

export async function postJsonFormApi(schema: string, data: object) {
  const { status } = await axios
    .post(`/api/form/schema/${schema}/answer/`, data)
    .catch((e) => {
      throw (
        e.response.data.data?.map(adaptJsonFormError) ?? [
          {
            keyword: 'custom',
            message: 'Server error',
            instancePath: '',
            schemaPath: '',
            params: {},
          },
        ]
      );
    });
  return status;
}
