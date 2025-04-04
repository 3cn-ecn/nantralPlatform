export interface ItemSaleDTO {
  id: number;
  quantity: number;
  item: number;
}

export type ItemSalePreviewDTO = Pick<ItemSaleDTO, 'id' | 'quantity' | 'item'>;

export type ItemSaleFormDTO = Pick<ItemSaleDTO, 'quantity' | 'item'>;
