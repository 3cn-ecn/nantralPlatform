import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { adaptItem } from '../infra/item.adapter';
import { convertItemForm } from '../infra/item.converter';
import { ItemDTO, ItemFormDTO } from '../infra/item.dto';
import { ItemForm } from '../types/item.type';

export async function addItemApi(formData: ItemForm) {
  const { data } = await axios
    .post<
      ItemFormDTO,
      AxiosResponse<ItemDTO>
    >('/api/nantralpay/item/', convertItemForm(formData), {})
    .catch((err: ApiFormErrorDTO<ItemFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptItem(data);
}
