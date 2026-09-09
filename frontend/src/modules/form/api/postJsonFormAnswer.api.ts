import axios from 'axios';
import { concat } from 'lodash';

import { JsonFormAnswerDTO } from '#modules/form/infra/jsonForm.dto';
import {
  adaptCustomJsonFormError,
  adaptJsonFormError,
} from '#modules/form/infra/jsonFormError.adapter';
import { JsonFormErrorDTO } from '#modules/form/infra/jsonFormError.dto';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function postJsonFormAnswerApi(schema: string, data: object) {
  const { status } = await axios
    .post(`/api/form/schema/${schema}/answer/`, { data })
    .catch((e) => {
      const apiError = adaptApiFormErrors<JsonFormAnswerDTO>(e);
      throw concat(
        (apiError.fields.data &&
          (apiError.fields.data as JsonFormErrorDTO[]).map(
            adaptJsonFormError,
          )) ||
          [],
        apiError.globalErrors.map(adaptCustomJsonFormError),
      );
    });
  return status;
}
