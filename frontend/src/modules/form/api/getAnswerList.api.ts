import options from '@apidevtools/json-schema-ref-parser/lib/options';
import axios from 'axios';
import { UUID } from 'crypto';

import {
  adaptJsonFormAnswer,
  adaptJsonFormAnswerPreview,
} from '#modules/form/infra/jsonForm.adapter';
import { JsonFormPreviewDTO } from '#modules/form/infra/jsonForm.dto';
import {
  JsonFormAnswer,
  JsonFormAnswerPreview,
} from '#modules/form/types/jsonForm.type';
import { adaptApiErrors } from '#shared/infra/errors';
import { OrderingField } from '#shared/infra/orderingFields.types';
import { adaptPage, Page } from '#shared/infra/pagination';

interface GetAnswerListApiOptions {
  user?: number;
  ordering?: OrderingField<JsonFormPreviewDTO> | null;
  page?: number | null;
  pageSize?: number | null;
  preview?: boolean;
}

export async function getAnswerListApi(
  schemaId: UUID,
  options: GetAnswerListApiOptions,
): Promise<
  Page<
    options extends { preview: false } ? JsonFormAnswer : JsonFormAnswerPreview
  >
> {
  const { data } = await axios
    .get(`/api/form/schema/${schemaId}/answer/`, {
      params: options,
    })
    .catch((e) => {
      throw adaptApiErrors(e);
    });

  return adaptPage(
    data,
    options.preview === false
      ? adaptJsonFormAnswer
      : adaptJsonFormAnswerPreview,
  );
}
