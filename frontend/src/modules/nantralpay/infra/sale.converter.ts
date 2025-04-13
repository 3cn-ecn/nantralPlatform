import { SaleForm } from '../types/sale.type';
import { convertContentForm } from './content.converter';
import { SaleFormDTO } from './sale.dto';

export function convertSaleForm(sale: SaleForm): SaleFormDTO {
  return {
    contents: sale.contents.map((itemSale) => convertContentForm(itemSale)),
    event: sale.event,
  };
}
