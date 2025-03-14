export interface ItemSale {
  id: number;
  quantity: number;
  item: number;
}

export type ItemSalePreview = Pick<ItemSale, 'id' | 'item' | 'quantity'>;

export interface ItemSaleForm {
  quantity: number;
  item: number;
}
