import axios from 'axios';

import { adaptJsonFormSchema } from '#modules/form/infra/jsonForm.adapter';
import { convertJsonFormSchema } from '#modules/form/infra/jsonForm.converter';
import { JsonFormSchema } from '#modules/form/types/jsonForm.type';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function updateJsonSchemaApi(
  uuid: string,
  jsonForm: Omit<JsonFormSchema, 'uuid'>,
) {
  const { data } = await axios
    .put(`/api/form/schema/${uuid}/`, convertJsonFormSchema(jsonForm))
    .catch((e) => {
      throw adaptApiFormErrors(e);
    });
  return adaptJsonFormSchema(data);
}
