import axios from 'axios';

import { adaptJsonFormSchema } from '#modules/form/infra/jsonForm.adapter';
import { adaptApiErrors } from '#shared/infra/errors';

export async function getJsonSchemaApi(uuid: string) {
  const { data } = await axios.get(`/api/form/schema/${uuid}/`).catch((e) => {
    throw adaptApiErrors(e);
  });
  return adaptJsonFormSchema(data);
}
