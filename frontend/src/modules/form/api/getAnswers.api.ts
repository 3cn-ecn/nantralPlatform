import axios from 'axios';
import { UUID } from 'crypto';

import { adaptJsonFormAnswer } from '#modules/form/infra/jsonForm.adapter';
import { adaptPage } from '#shared/infra/pagination';

interface GetAnswersApiOptions {
  user: number;
}

export async function getAnswerApi(
  schemaId: UUID,
  options: GetAnswersApiOptions,
) {
  const { data } = await axios.get(`/api/form/schema/${schemaId}/answer/`, {
    params: options,
  });

  return adaptPage(data, adaptJsonFormAnswer);
}
