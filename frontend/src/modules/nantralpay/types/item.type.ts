export interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export type ItemPreview = Pick<Item, 'id' | 'name' | 'price' | 'quantity'>;

export interface ItemForm {
  name: string;
  price: number;
}
