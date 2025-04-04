import { ItemSale, ItemSalePreview } from '../types/itemSale.type';
import { ItemSaleDTO, ItemSalePreviewDTO } from './itemSale.dto';

export function adaptItemSale(itemSaleDto: ItemSaleDTO): ItemSale {
  return {
    id: itemSaleDto.id,
    quantity: itemSaleDto.quantity,
    item: itemSaleDto.item,
  };
}

export function adaptItemSalePreview(
  itemSaleDto: ItemSalePreviewDTO,
): ItemSalePreview {
  return {
    id: itemSaleDto.id,
    quantity: itemSaleDto.quantity,
    item: itemSaleDto.item,
  };
}
