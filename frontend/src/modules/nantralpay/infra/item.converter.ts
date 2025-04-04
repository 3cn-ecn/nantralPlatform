import { ItemForm } from '../types/item.type';
import { ItemFormDTO } from './item.dto';

export function convertItemForm(itemSale: ItemForm): ItemFormDTO {
  return {
    name: itemSale.name,
    price: itemSale.price,
  };
}
