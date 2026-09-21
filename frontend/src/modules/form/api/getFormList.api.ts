import axios from 'axios';

import { adaptJsonFormPreview } from '#modules/form/infra/jsonForm.adapter';
import { JsonFormPreviewDTO } from '#modules/form/infra/jsonForm.dto';
import { JsonFormPreview } from '#modules/form/types/jsonForm.type';
import { adaptApiErrors, ApiErrorDTO } from '#shared/infra/errors';
import { OrderingField } from '#shared/infra/orderingFields.types';
import { adaptPage, Page, PageDTO } from '#shared/infra/pagination';

export interface FormListQueryParams {
  search?: string | null;
  ordering?: OrderingField<JsonFormPreviewDTO> | null;
  page?: number | null;
  pageSize?: number | null;
}

export async function getFormListApi(
  params: FormListQueryParams = {},
): Promise<Page<JsonFormPreview>> {
  const { data } = await axios
    .get<PageDTO<JsonFormPreviewDTO>>('/api/form/schema/', {
      params: {
        search: params.search,
        ordering: params.ordering,
        page: params.page,
        page_size: params.pageSize,
      },
    })
    .catch((err: ApiErrorDTO) => {
      throw adaptApiErrors(err);
    });

  return adaptPage(data, adaptJsonFormPreview);
}
