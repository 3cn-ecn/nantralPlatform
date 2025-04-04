import { Item } from '../types/item.type';
import { ItemDTO } from './item.dto';

export function adaptItem(itemDTO: ItemDTO): Item {
  return {
    id: itemDTO.id,
    name: itemDTO.name,
    price: itemDTO.price,
    quantity: 0,
  };
}
