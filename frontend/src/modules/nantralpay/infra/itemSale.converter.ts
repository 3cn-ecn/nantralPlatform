import { ItemSaleForm } from '../types/itemSale.type';
import { ItemSaleFormDTO } from './itemSale.dto';

export function convertItemSaleForm(itemSale: ItemSaleForm): ItemSaleFormDTO {
  return {
    item: itemSale.item,
    quantity: itemSale.quantity,
  };
}
