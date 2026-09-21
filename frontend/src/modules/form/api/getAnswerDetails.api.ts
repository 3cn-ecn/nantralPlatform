import axios from 'axios';
import { UUID } from 'crypto';

import { adaptJsonFormAnswer } from '#modules/form/infra/jsonForm.adapter';
import { adaptApiErrors } from '#shared/infra/errors';

export async function getAnswerDetailsApi(schemaId: UUID, answerId: UUID) {
  const { data } = await axios
    .get(`/api/form/schema/${schemaId}/answer/${answerId}/`)
    .catch((e) => {
      throw adaptApiErrors(e);
    });

  return adaptJsonFormAnswer(data);
}
