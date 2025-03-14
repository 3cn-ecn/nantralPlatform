import axios, { AxiosResponse } from 'axios';

import { ApiFormErrorDTO, adaptApiFormErrors } from '#shared/infra/errors';

import { adaptSale } from '../infra/sale.adapter';
import { convertSaleForm } from '../infra/sale.converter';
import { SaleDTO, SaleFormDTO } from '../infra/sale.dto';
import { SaleForm } from '../types/sale.type';

export async function createSaleApi(formData: SaleForm) {
  const { data } = await axios
    .post<
      SaleFormDTO,
      AxiosResponse<SaleDTO>
    >('/api/nantralpay/sale/', convertSaleForm(formData), {})
    .catch((err: ApiFormErrorDTO<SaleFormDTO>) => {
      throw adaptApiFormErrors(err);
    });
  return adaptSale(data);
}
