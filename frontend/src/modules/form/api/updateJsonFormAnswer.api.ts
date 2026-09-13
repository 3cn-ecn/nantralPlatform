import axios from 'axios';
import { UUID } from 'crypto';
import { concat } from 'lodash';

import { JsonFormAnswerDTO } from '#modules/form/infra/jsonForm.dto';
import {
  adaptCustomJsonFormError,
  adaptJsonFormError,
} from '#modules/form/infra/jsonFormError.adapter';
import { JsonFormErrorDTO } from '#modules/form/infra/jsonFormError.dto';
import { adaptApiFormErrors } from '#shared/infra/errors';

export async function updateJsonFormAnswerApi(
  schema: string,
  answerId: UUID,
  data: object,
) {
  const { status } = await axios
    .put(`/api/form/schema/${schema}/answer/${answerId}/`, { data })
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
