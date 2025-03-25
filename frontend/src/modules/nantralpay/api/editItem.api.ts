import axios, { AxiosResponse } from 'axios';

import { adaptItemPreview } from '#modules/nantralpay/infra/item.adapter';
import { convertItemForm } from '#modules/nantralpay/infra/item.converter';
import { ItemDTO, ItemFormDTO } from '#modules/nantralpay/infra/item.dto';
import { ItemForm } from '#modules/nantralpay/types/item.type';
import { adaptApiFormErrors, ApiFormErrorDTO } from '#shared/infra/errors';

export async function editItemApi(id: number, formData: ItemForm) {
  const { data } = await axios
    .put<
      ItemFormDTO,
      AxiosResponse<ItemDTO>
    >(`/api/nantralpay/item/${id}/`, convertItemForm(formData))
    .catch((err: ApiFormErrorDTO<ItemFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptItemPreview(data);
}
