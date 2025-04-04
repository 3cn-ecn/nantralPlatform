import { ItemForm, ItemPreview } from '../types/item.type';

export function convertItemToForm(
  item: ItemPreview,
  eventId: number,
): ItemForm {
  return {
    event: eventId,
    name: item.name,
    price: item.price,
  };
}
