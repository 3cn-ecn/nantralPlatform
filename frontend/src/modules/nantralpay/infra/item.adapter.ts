import { Item, ItemPreview } from '../types/item.type';
import { ItemDTO } from './item.dto';

export function adaptItem(itemDTO: ItemDTO): Item {
  return {
    id: itemDTO.id,
    image: itemDTO.image,
    name: itemDTO.name,
    price: itemDTO.price,
    quantity: 0,
    event: itemDTO.event,
  };
}

export function adaptItemPreview(itemDTO: ItemDTO): ItemPreview {
  return {
    id: itemDTO.id,
    name: itemDTO.name,
    price: itemDTO.price,
    event: itemDTO.event,
    image: itemDTO.image,
  };
}
